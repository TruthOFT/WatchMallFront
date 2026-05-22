<template>
  <div class="page-shell">
    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>最近订单</h3>
          <p>展示最新的订单流转情况，便于快速进入订单详情。</p>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="summary.recentOrderList || []"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 980 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'orderNo'">
            <div class="order-cell">
              <strong>{{ record.orderNo || "-" }}</strong>
              <span>用户ID：{{ record.userId || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'receiver'">
            <div class="order-cell">
              <strong>{{ record.receiverName || "-" }}</strong>
              <span>{{ record.receiverPhone || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'amount'">
            {{ formatAmount(record.payAmount) }}
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="getOrderStatusColor(record.orderStatus)">
              {{ getOrderStatusText(record.orderStatus) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="router.push('/order/list')">前往订单页</a-button>
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { getAdminDashboardSummary } from "@/api/dashboardController";

const router = useRouter();
const loading = ref(false);
const summary = reactive<API.DashboardSummaryVO>({
  recentOrderList: [],
});

const columns: TableColumnsType<API.OrderAdminPageVO> = [
  { title: "订单信息", key: "orderNo", width: 260 },
  { title: "收货人", key: "receiver", width: 180 },
  { title: "订单摘要", dataIndex: "productSummary", key: "productSummary", width: 240 },
  { title: "实付金额", key: "amount", width: 130 },
  { title: "状态", key: "status", width: 110 },
  { title: "下单时间", key: "createTime", width: 180 },
  { title: "操作", key: "action", width: 120 },
];

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

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getAdminDashboardSummary();
    if (res.code === 0 && res.data) {
      Object.assign(summary, res.data);
      return;
    }
    message.error(res.message || "加载看板失败");
  } catch {
    message.error("加载看板失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.panel,

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #bee8ff;
}

.desc {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.7;
  color: #dbf5ff;
}





.panel {
  padding: 20px;
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h3 {
  margin: 0;
  color: #17304c;
}

.panel-header p {
  margin: 8px 0 0;
  color: #69819a;
}

.order-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-cell span {
  color: #68829f;
  font-size: 12px;
}
</style>
