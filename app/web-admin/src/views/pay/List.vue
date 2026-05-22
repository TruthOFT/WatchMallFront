<template>
  <div class="page-shell">
    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.keyword"
            placeholder="搜索订单号或支付单号"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-input
            v-model:value="queryForm.userId"
            placeholder="用户ID"
            allow-clear
            class="short-input"
          />
          <a-select
            v-model:value="queryForm.payStatus"
            allow-clear
            placeholder="支付状态"
            class="short-input"
            :options="payStatusOptions"
          />
          <a-range-picker
            v-model:value="payTimeRange"
            show-time
            value-format="YYYY-MM-DD HH:mm:ss"
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
          <template v-if="column.key === 'payNo'">
            <div class="pay-cell">
              <strong>{{ record.payNo || "-" }}</strong>
              <span>订单号：{{ record.orderNo || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'userId'">
            {{ record.userId || "-" }}
          </template>

          <template v-else-if="column.key === 'payStatus'">
            <a-tag :color="getPayStatusColor(record.payStatus)">
              {{ getPayStatusText(record.payStatus) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'payAmount'">
            {{ formatAmount(record.payAmount) }}
          </template>

          <template v-else-if="column.key === 'payTime'">
            {{ formatDate(record.payTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="openDetail(record.id)">查看详情</a-button>
              <a-button type="link" @click="router.push('/order/list')">订单页</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </section>

    <a-drawer
      v-model:open="detailVisible"
      title="支付详情"
      :width="640"
      destroy-on-close
    >
      <a-spin :spinning="detailLoading">
        <template v-if="detailData">
          <a-descriptions :column="2" size="small" bordered>
            <a-descriptions-item label="支付单号">{{ detailData.payNo || "-" }}</a-descriptions-item>
            <a-descriptions-item label="订单号">{{ detailData.orderNo || "-" }}</a-descriptions-item>
            <a-descriptions-item label="用户ID">{{ detailData.userId || "-" }}</a-descriptions-item>
            <a-descriptions-item label="支付状态">
              <a-tag :color="getPayStatusColor(detailData.payStatus)">
                {{ getPayStatusText(detailData.payStatus) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="支付方式">{{ getPayTypeText(detailData.payType) }}</a-descriptions-item>
            <a-descriptions-item label="支付金额">{{ formatAmount(detailData.payAmount) }}</a-descriptions-item>
            <a-descriptions-item label="支付时间">{{ formatDate(detailData.payTime) }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ formatDate(detailData.createTime) }}</a-descriptions-item>
            <a-descriptions-item label="更新时间">{{ formatDate(detailData.updateTime) }}</a-descriptions-item>
            <a-descriptions-item label="备注">{{ detailData.remark || "-" }}</a-descriptions-item>
          </a-descriptions>
        </template>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { getAdminPayLogDetail, pageAdminPayLogs } from "@/api/payController";

const router = useRouter();
const columns: TableColumnsType<API.PayLogAdminPageVO> = [
  { title: "支付信息", key: "payNo", width: 280 },
  { title: "用户ID", key: "userId", width: 120 },
  { title: "支付状态", key: "payStatus", width: 120 },
  { title: "支付金额", key: "payAmount", width: 130 },
  { title: "支付时间", key: "payTime", width: 180 },
  { title: "备注", dataIndex: "remark", key: "remark", width: 200 },
  { title: "操作", key: "action", width: 160, fixed: "right" },
];

const queryForm = reactive<API.PayLogAdminQueryRequest>({
  keyword: "",
  userId: undefined,
  payStatus: undefined,
});

const payTimeRange = ref<[string, string]>();
const tableData = ref<API.PayLogAdminPageVO[]>([]);
const loading = ref(false);
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailData = ref<API.PayLogAdminDetailVO>();

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const payStatusOptions = [
  { label: "支付成功", value: 1 },
];

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  return dayjs(value).isValid() ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : value;
};

const formatAmount = (value?: number) => `¥${Number(value ?? 0).toFixed(2)}`;

const getPayStatusText = (status?: number) => (status === 1 ? "支付成功" : "未知状态");
const getPayStatusColor = (status?: number) => (status === 1 ? "green" : "default");
const getPayTypeText = (type?: number) => (type === 1 ? "模拟支付" : "其他");

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await pageAdminPayLogs({
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword?.trim() || undefined,
      userId: queryForm.userId?.trim() || undefined,
      payStatus: queryForm.payStatus,
      payTimeStart: payTimeRange.value?.[0],
      payTimeEnd: payTimeRange.value?.[1],
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载支付记录失败");
  } catch {
    message.error("加载支付记录失败");
  } finally {
    loading.value = false;
  }
};

const openDetail = async (id?: string) => {
  if (!id) {
    return;
  }
  detailVisible.value = true;
  detailLoading.value = true;
  detailData.value = undefined;
  try {
    const res = await getAdminPayLogDetail({ id });
    if (res.code === 0 && res.data) {
      detailData.value = res.data;
      return;
    }
    message.error(res.message || "加载支付详情失败");
    detailVisible.value = false;
  } catch {
    message.error("加载支付详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const handleResetSearch = () => {
  queryForm.keyword = "";
  queryForm.userId = undefined;
  queryForm.payStatus = undefined;
  payTimeRange.value = undefined;
  fetchData(true);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  fetchData();
};

fetchData();
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
  color: #ffe0bd;
}

.desc {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.7;
  color: #fff1e2;
}





.panel {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  width: 280px;
}

.short-input {
  width: 150px;
}

.pay-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pay-cell span {
  color: #68829f;
  font-size: 12px;
}

@media (max-width: 980px) {
  .toolbar,
  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
  }

  .search-input,
  .short-input {
    width: 100%;
  }
}
</style>
