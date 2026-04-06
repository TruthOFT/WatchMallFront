<template>
  <div class="page-shell">
    <section class="hero-card">
      <div>
        <p class="eyebrow">Order Admin</p>
        <h2>订单管理</h2>
        <p class="desc">按订单号、收货人或手机号筛选订单，查看支付状态、超时风险和完整订单支付明细。</p>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span>订单总数</span>
          <strong>{{ stats.totalCount ?? 0 }}</strong>
        </div>
        <div class="stat-card">
          <span>待支付</span>
          <strong>{{ stats.pendingCount ?? 0 }}</strong>
        </div>
        <div class="stat-card">
          <span>已支付</span>
          <strong>{{ stats.paidCount ?? 0 }}</strong>
        </div>
        <div class="stat-card">
          <span>超时未付</span>
          <strong>{{ stats.overduePendingCount ?? 0 }}</strong>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.keyword"
            placeholder="搜索订单号、收货人、手机号"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-select
            v-model:value="queryForm.orderStatus"
            allow-clear
            placeholder="筛选订单状态"
            class="status-select"
            :options="statusOptions"
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
        :scroll="{ x: 1220 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderNo'">
            <div class="order-no-cell">
              <strong>{{ record.orderNo || "-" }}</strong>
              <span>用户ID：{{ record.userId || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'receiver'">
            <div class="receiver-cell">
              <strong>{{ record.receiverName || "-" }}</strong>
              <span>{{ record.receiverPhone || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'productSummary'">
            <div class="summary-cell">
              <strong>{{ record.productSummary || "-" }}</strong>
              <span>共 {{ record.itemCount ?? 0 }} 件</span>
            </div>
          </template>

          <template v-else-if="column.key === 'amount'">
            <div class="amount-cell">
              <strong>{{ formatAmount(record.payAmount) }}</strong>
              <span>总额 {{ formatAmount(record.totalAmount) }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'risk'">
            <a-tag v-if="isOrderOverdue(record)" color="red">超时未支付</a-tag>
            <span v-else>-</span>
          </template>

          <template v-else-if="column.key === 'orderStatus'">
            <a-tag :color="getOrderStatusColor(record.orderStatus)">
              {{ getOrderStatusText(record.orderStatus) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="openDetail(record.id)">查看详情</a-button>
          </template>
        </template>
      </a-table>
    </section>

    <a-drawer
      v-model:open="detailVisible"
      title="订单详情"
      :width="820"
      destroy-on-close
    >
      <a-spin :spinning="detailLoading">
        <template v-if="detailData">
          <section class="detail-section">
            <h3>基础信息</h3>
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="订单号">{{ detailData.orderNo || "-" }}</a-descriptions-item>
              <a-descriptions-item label="用户ID">{{ detailData.userId || "-" }}</a-descriptions-item>
              <a-descriptions-item label="订单状态">
                <a-tag :color="getOrderStatusColor(detailData.orderStatus)">
                  {{ getOrderStatusText(detailData.orderStatus) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="备注">{{ detailData.remark || "-" }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <h3>金额信息</h3>
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="订单总额">{{ formatAmount(detailData.totalAmount) }}</a-descriptions-item>
              <a-descriptions-item label="实付金额">{{ formatAmount(detailData.payAmount) }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <h3>收货信息</h3>
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="收货人">{{ detailData.receiverName || "-" }}</a-descriptions-item>
              <a-descriptions-item label="手机号">{{ detailData.receiverPhone || "-" }}</a-descriptions-item>
              <a-descriptions-item label="地址ID">{{ detailData.addressId || "-" }}</a-descriptions-item>
              <a-descriptions-item label="完整地址">{{ formatAddress(detailData) }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <h3>时间信息</h3>
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="下单时间">{{ formatDate(detailData.createTime) }}</a-descriptions-item>
              <a-descriptions-item label="支付时间">{{ formatDate(detailData.payTime) }}</a-descriptions-item>
              <a-descriptions-item label="关闭时间">{{ formatDate(detailData.closeTime) }}</a-descriptions-item>
              <a-descriptions-item label="超时时间">{{ formatDate(detailData.expireTime) }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <h3>支付记录</h3>
            <div v-if="detailData.payLogList?.length" class="pay-log-list">
              <div v-for="payLog in detailData.payLogList" :key="payLog.id" class="pay-log-card">
                <div class="pay-log-head">
                  <strong>{{ payLog.payNo || "-" }}</strong>
                  <a-tag :color="getPayStatusColor(payLog.payStatus)">{{ getPayStatusText(payLog.payStatus) }}</a-tag>
                </div>
                <div class="pay-log-meta">
                  <span>金额 {{ formatAmount(payLog.payAmount) }}</span>
                  <span>时间 {{ formatDate(payLog.payTime) }}</span>
                  <span>备注 {{ payLog.remark || "-" }}</span>
                </div>
              </div>
            </div>
            <a-empty v-else description="暂无支付记录" />
          </section>

          <section class="detail-section">
            <h3>订单项</h3>
            <div v-if="detailData.itemList?.length" class="item-list">
              <div v-for="item in detailData.itemList" :key="item.id" class="item-card">
                <a-image
                  v-if="item.skuImage"
                  :src="getImageUrl(item.skuImage)"
                  :width="72"
                  class="item-image"
                />
                <div v-else class="item-placeholder">
                  {{ (item.productName || "O").slice(0, 1) }}
                </div>
                <div class="item-content">
                  <strong>{{ item.productName || "-" }}</strong>
                  <span>{{ item.skuName || item.productTitle || "-" }}</span>
                  <div class="item-meta">
                    <span>单价 {{ formatAmount(item.price) }}</span>
                    <span>数量 {{ item.quantity ?? 0 }}</span>
                    <span>小计 {{ formatAmount(item.totalAmount) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <a-empty v-else description="暂无订单项" />
          </section>
        </template>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { getAdminOrderDetail, getAdminOrderStats, pageAdminOrders } from "@/api/orderController";
import { BASE_URL } from "@/request";

const columns: TableColumnsType<API.OrderAdminPageVO> = [
  { title: "订单信息", key: "orderNo", width: 250 },
  { title: "收货人", key: "receiver", width: 180 },
  { title: "订单摘要", dataIndex: "productSummary", key: "productSummary", width: 240 },
  { title: "金额", key: "amount", width: 140 },
  { title: "风险", key: "risk", width: 140 },
  { title: "状态", dataIndex: "orderStatus", key: "orderStatus", width: 110 },
  { title: "下单时间", dataIndex: "createTime", key: "createTime", width: 180 },
  { title: "操作", key: "action", fixed: "right", width: 120 },
];

const queryForm = reactive<API.OrderAdminQueryRequest>({
  keyword: "",
  orderStatus: undefined,
});

const tableData = ref<API.OrderAdminPageVO[]>([]);
const loading = ref(false);
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailData = ref<API.OrderAdminDetailVO>();
const stats = reactive<API.OrderAdminStatsVO>({});

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const statusOptions = [
  { label: "待支付", value: 0 },
  { label: "已支付", value: 1 },
  { label: "已关闭", value: 2 },
];

const getImageUrl = (path?: string) => {
  if (!path) {
    return "";
  }
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  return dayjs(value).isValid() ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : value;
};

const formatAmount = (value?: number) => `¥${Number(value ?? 0).toFixed(2)}`;

const getOrderStatusText = (status?: number) => {
  if (status === 1) {
    return "已支付";
  }
  if (status === 2) {
    return "已关闭";
  }
  return "待支付";
};

const getOrderStatusColor = (status?: number) => {
  if (status === 1) {
    return "green";
  }
  if (status === 2) {
    return "default";
  }
  return "orange";
};

const getPayStatusText = (status?: number) => (status === 1 ? "支付成功" : "未知状态");
const getPayStatusColor = (status?: number) => (status === 1 ? "green" : "default");

const formatAddress = (detail?: API.OrderAdminDetailVO) => {
  if (!detail) {
    return "-";
  }
  const parts = [detail.province, detail.city, detail.district, detail.detailAddress]
    .map((item) => (item || "").trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : "-";
};

const isOrderOverdue = (record?: API.OrderAdminPageVO) => {
  if (!record || record.orderStatus !== 0 || !record.createTime) {
    return false;
  }
  const expireTime = dayjs(record.createTime).add(15, "minute");
  return expireTime.isValid() && expireTime.isBefore(dayjs());
};

const fetchStats = async () => {
  const res = await getAdminOrderStats();
  if (res.code === 0 && res.data) {
    Object.assign(stats, res.data);
  }
};

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await pageAdminOrders({
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword?.trim() || undefined,
      orderStatus: queryForm.orderStatus,
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载订单失败");
  } catch {
    message.error("加载订单失败");
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
    const res = await getAdminOrderDetail({ id });
    if (res.code === 0 && res.data) {
      detailData.value = res.data;
      return;
    }
    message.error(res.message || "加载订单详情失败");
    detailVisible.value = false;
  } catch {
    message.error("加载订单详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const handleResetSearch = () => {
  queryForm.keyword = "";
  queryForm.orderStatus = undefined;
  fetchData(true);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  fetchData();
};

onMounted(async () => {
  await Promise.all([fetchStats(), fetchData()]);
});
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card,
.panel {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(186, 201, 218, 0.55);
  box-shadow: 0 18px 40px rgba(19, 42, 68, 0.08);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
  background: linear-gradient(120deg, rgba(40, 53, 131, 0.94) 0%, rgba(21, 101, 192, 0.88) 100%);
  color: #f5f8ff;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #c2d9ff;
}

.hero-card h2 {
  margin: 0;
  font-size: 30px;
}

.desc {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.7;
  color: #dde8ff;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 12px;
  min-width: 520px;
}

.stat-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #dce8ff;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
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
}

.search-input {
  width: 320px;
}

.status-select {
  width: 180px;
}

.order-no-cell,
.receiver-cell,
.summary-cell,
.amount-cell,
.pay-log-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-no-cell span,
.receiver-cell span,
.summary-cell span,
.amount-cell span,
.pay-log-meta span {
  color: #68829f;
  font-size: 12px;
}

.detail-section + .detail-section {
  margin-top: 20px;
}

.detail-section h3 {
  margin: 0 0 12px;
  color: #17304c;
  font-size: 16px;
}

.pay-log-list,
.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pay-log-card,
.item-card {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(186, 201, 218, 0.55);
  background: #f8fbff;
}

.pay-log-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.item-card {
  display: flex;
  gap: 14px;
  align-items: center;
}

.item-image {
  border-radius: 12px;
  overflow: hidden;
}

.item-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.item-content span {
  color: #68829f;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
}

@media (max-width: 1200px) {
  .hero-card,
  .toolbar,
  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    min-width: 0;
  }

  .search-input,
  .status-select {
    width: 100%;
  }
}
</style>
