<template>
  <div class="page-shell">
    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.keyword"
            placeholder="搜索主题、联系人、邮箱、账号"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-select
            v-model:value="queryForm.status"
            allow-clear
            placeholder="筛选状态"
            class="select-input"
            :options="statusOptions"
          />
          <a-select
            v-model:value="queryForm.source"
            allow-clear
            placeholder="筛选来源"
            class="select-input"
            :options="sourceOptions"
          />
        </div>
        <div class="toolbar-right">
          <a-button @click="handleResetSearch">重置</a-button>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'subject'">
            <div class="subject-cell">
              <strong>{{ record.subject || "-" }}</strong>
              <span>{{ record.latestMessage || "暂无最新消息" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'user'">
            <div class="meta-cell">
              <strong>{{ record.userName || record.contactName || "匿名用户" }}</strong>
              <span>{{ record.userAccount || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'contact'">
            <div class="meta-cell">
              <span>{{ record.contactPhone || "-" }}</span>
              <span>{{ record.contactEmail || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>

          <template v-else-if="column.key === 'source'">
            <a-tag :color="record.source === 'ai' ? 'purple' : 'blue'">{{ getSourceText(record.source) }}</a-tag>
          </template>

          <template v-else-if="column.key === 'lastMessageTime'">
            {{ formatDate(record.lastMessageTime) }}
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="openDetail(record.id)">处理工单</a-button>
          </template>
        </template>
      </a-table>
    </section>

    <a-drawer
      v-model:open="detailVisible"
      title="客服工单详情"
      :width="860"
      destroy-on-close
    >
      <a-spin :spinning="detailLoading">
        <template v-if="detailData?.ticket">
          <section class="detail-section">
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="工单主题">{{ detailData.ticket.subject || "-" }}</a-descriptions-item>
              <a-descriptions-item label="工单状态">
                <a-tag :color="getStatusColor(detailData.ticket.status)">{{ getStatusText(detailData.ticket.status) }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="用户">{{ detailData.ticket.userName || detailData.ticket.userAccount || "-" }}</a-descriptions-item>
              <a-descriptions-item label="会话来源">{{ getSourceText(detailData.ticket.source) }}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{ detailData.ticket.contactPhone || "-" }}</a-descriptions-item>
              <a-descriptions-item label="联系邮箱">{{ detailData.ticket.contactEmail || "-" }}</a-descriptions-item>
              <a-descriptions-item label="最后消息时间">{{ formatDate(detailData.ticket.lastMessageTime) }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">{{ formatDate(detailData.ticket.createTime) }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <div class="detail-head">
              <h3>会话消息</h3>
              <div class="status-actions">
                <a-button @click="handleUpdateStatus('pending')">标记待处理</a-button>
                <a-button @click="handleUpdateStatus('replied')">标记已回复</a-button>
                <a-button danger @click="handleUpdateStatus('closed')">关闭工单</a-button>
              </div>
            </div>

            <div class="message-list">
              <div
                v-for="item in detailData.messageList || []"
                :key="item.id"
                :class="['message-item', item.senderRole === 'admin' ? 'admin' : item.senderRole === 'ai' ? 'ai' : 'user']"
              >
                <div class="message-meta">
                  <strong>{{ item.senderName || getSenderLabel(item.senderRole) }}</strong>
                  <span>{{ formatDate(item.createTime) }}</span>
                </div>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </section>

          <section class="detail-section">
            <h3>人工回复</h3>
            <a-textarea
              v-model:value="replyForm.content"
              :rows="4"
              placeholder="输入给用户的回复内容"
            />
            <div class="reply-actions">
              <a-button type="primary" :loading="replying" @click="handleReply">发送回复</a-button>
            </div>
          </section>
        </template>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import dayjs from "dayjs";
import type { TableColumnsType } from "ant-design-vue";
import { message } from "ant-design-vue";
import {
  getAdminSupportDetail,
  pageAdminSupportTickets,
  replyAdminSupport,
  updateAdminSupportStatus,
  type SupportAdminPageVO,
  type SupportTicketDetailVO,
} from "@/api/supportController";

const columns: TableColumnsType<SupportAdminPageVO> = [
  { title: "工单主题", key: "subject", width: 320 },
  { title: "用户", key: "user", width: 220 },
  { title: "联系方式", key: "contact", width: 240 },
  { title: "状态", key: "status", width: 120 },
  { title: "来源", key: "source", width: 120 },
  { title: "最后消息时间", key: "lastMessageTime", width: 180 },
  { title: "创建时间", key: "createTime", width: 180 },
  { title: "操作", key: "action", width: 120, fixed: "right" },
];

const queryForm = reactive({
  keyword: "",
  status: undefined as string | undefined,
  source: undefined as string | undefined,
});

const statusOptions = [
  { label: "待处理", value: "pending" },
  { label: "已回复", value: "replied" },
  { label: "已关闭", value: "closed" },
];

const sourceOptions = [
  { label: "人工会话", value: "manual" },
  { label: "AI 会话", value: "ai" },
];

const tableData = ref<SupportAdminPageVO[]>([]);
const loading = ref(false);
const detailVisible = ref(false);
const detailLoading = ref(false);
const replying = ref(false);
const currentTicketId = ref("");
const detailData = ref<SupportTicketDetailVO>();
const replyForm = reactive({
  content: "",
});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  return dayjs(value).isValid() ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : value;
};

const getStatusText = (status?: string) => {
  if (status === "replied") {
    return "已回复";
  }
  if (status === "closed") {
    return "已关闭";
  }
  return "待处理";
};

const getStatusColor = (status?: string) => {
  if (status === "replied") {
    return "green";
  }
  if (status === "closed") {
    return "default";
  }
  return "gold";
};

const getSourceText = (source?: string) => (source === "ai" ? "AI 会话" : "人工会话");

const getSenderLabel = (senderRole?: string) => {
  if (senderRole === "admin") {
    return "管理员";
  }
  if (senderRole === "ai") {
    return "AI 客服";
  }
  return "用户";
};

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await pageAdminSupportTickets({
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword?.trim() || undefined,
      status: queryForm.status,
      source: queryForm.source,
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载客服工单失败");
  } catch (error) {
    console.error("fetch support admin page error", error);
    message.error("加载客服工单失败");
  } finally {
    loading.value = false;
  }
};

const openDetail = async (ticketId?: string) => {
  if (!ticketId) {
    return;
  }
  currentTicketId.value = ticketId;
  detailVisible.value = true;
  detailLoading.value = true;
  replyForm.content = "";
  try {
    const res = await getAdminSupportDetail(ticketId);
    if (res.code === 0 && res.data) {
      detailData.value = res.data;
      return;
    }
    throw new Error(res.message || "加载工单详情失败");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "加载工单详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const handleReply = async () => {
  if (!currentTicketId.value) {
    return;
  }
  if (!replyForm.content.trim()) {
    message.warning("请输入回复内容");
    return;
  }
  replying.value = true;
  try {
    const res = await replyAdminSupport({
      ticketId: currentTicketId.value,
      content: replyForm.content.trim(),
    });
    if (res.code === 0) {
      message.success("回复已发送");
      replyForm.content = "";
      await openDetail(currentTicketId.value);
      await fetchData();
      return;
    }
    message.error(res.message || "回复发送失败");
  } catch (error) {
    console.error("reply support error", error);
    message.error("回复发送失败");
  } finally {
    replying.value = false;
  }
};

const handleUpdateStatus = async (status: string) => {
  if (!currentTicketId.value) {
    return;
  }
  try {
    const res = await updateAdminSupportStatus({
      ticketId: currentTicketId.value,
      status,
    });
    if (res.code === 0) {
      message.success("工单状态已更新");
      await openDetail(currentTicketId.value);
      await fetchData();
      return;
    }
    message.error(res.message || "工单状态更新失败");
  } catch (error) {
    console.error("update support status error", error);
    message.error("工单状态更新失败");
  }
};

const handleResetSearch = () => {
  queryForm.keyword = "";
  queryForm.status = undefined;
  queryForm.source = undefined;
  void fetchData(true);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  void fetchData();
};

void fetchData();
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(186, 201, 218, 0.55);
  box-shadow: 0 18px 40px rgba(19, 42, 68, 0.08);
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #f5e5c8;
}

.desc {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.7;
  color: #f7efe1;
}





.panel {
  padding: 20px;
}

.toolbar,
.toolbar-left,
.toolbar-right,
.detail-head,
.status-actions,
.reply-actions {
  display: flex;
  gap: 12px;
}

.toolbar,
.detail-head {
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-input {
  width: 320px;
}

.select-input {
  width: 160px;
}

.subject-cell,
.meta-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subject-cell span,
.meta-cell span {
  color: #68829f;
  font-size: 12px;
}

.detail-section + .detail-section {
  margin-top: 20px;
}

.detail-section h3 {
  margin: 0;
  color: #17304c;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow: auto;
}

.message-item {
  padding: 14px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid rgba(186, 201, 218, 0.55);
}

.message-item.admin {
  background: #eff7ff;
}

.message-item.ai {
  background: #f6f0ff;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #68829f;
  font-size: 12px;
}

.message-item p {
  margin: 8px 0 0;
  line-height: 1.8;
  white-space: pre-wrap;
}

.reply-actions {
  justify-content: flex-end;
  margin-top: 12px;
}

@media (max-width: 980px) {
  .toolbar,
  .toolbar-left,
  .toolbar-right,
  .detail-head,
  .status-actions {
    flex-direction: column;
  }

  .search-input,
  .select-input {
    width: 100%;
  }
}
</style>
