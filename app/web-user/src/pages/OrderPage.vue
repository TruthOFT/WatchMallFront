<template>
  <div class="order-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ texts.pageTitle }}</h1>
        <p>{{ texts.pageSubtitle }}</p>
      </div>

      <div v-if="loading" class="state-wrap liquid-glass">
        <a-spin size="large" />
      </div>

      <div v-else class="orders-list">
        <div v-if="orders.length === 0" class="empty-orders liquid-glass">
          <p>{{ texts.emptyDescription }}</p>
          <router-link to="/">
            <a-button type="primary">{{ texts.goShopping }}</a-button>
          </router-link>
        </div>

        <div v-else v-for="order in orders" :key="order.id" class="order-card liquid-glass">
          <div class="order-header">
            <div class="header-left">
              <span class="order-id">{{ texts.orderNoPrefix }}{{ order.orderNo }}</span>
              <span class="order-date">{{ formatDate(order.createTime) }}</span>
            </div>
            <div class="header-right">
              <a-tag :color="getStatusColor(order)" class="status-tag">
                {{ formatStatus(order) }}
              </a-tag>
            </div>
          </div>

          <div v-if="order.orderStatus === ORDER_STATUS_PENDING_PAY" class="countdown-panel">
            <template v-if="isExpired(order)">
              <div class="countdown-expired">{{ texts.expiredPending }}</div>
            </template>
            <template v-else>
              <div class="countdown-main">
                {{ texts.remainingLabel }}{{ formatRemaining(order) }}
              </div>
            </template>
            <div class="countdown-sub">
              {{ texts.expireTimeLabel }}{{ formatDate(order.expireTime) }}
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.itemList ?? []" :key="item.id" class="order-item">
              <div
                class="item-img"
                :style="{ backgroundImage: item.skuImage ? `url(${resolveAssetUrl(item.skuImage)})` : undefined }"
              >
                <span v-if="!item.skuImage" class="img-placeholder">{{ texts.noImage }}</span>
              </div>
              <div class="item-info">
                <h4>{{ item.productName || texts.defaultProductName }}</h4>
                <p v-if="item.productTitle">{{ item.productTitle }}</p>
                <p>{{ item.skuName || texts.defaultSkuName }}</p>
                <p>{{ texts.quantityPrefix }}{{ item.quantity ?? 0 }}</p>
              </div>
              <div class="item-price">
                {{ formatCurrency(item.totalAmount ?? 0) }}
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="total-info">
              <span>{{ texts.totalLabel }}</span>
              <span class="total-price">
                {{ formatCurrency(order.payAmount ?? order.totalAmount ?? 0) }}
              </span>
            </div>
            <div class="order-actions">
              <a-button type="primary" class="order-action-btn" @click="viewDetails(order.id)">
                {{ texts.viewDetail }}
              </a-button>
              <a-button
                v-if="order.orderStatus === ORDER_STATUS_PENDING_PAY"
                type="primary"
                class="order-action-btn"
                :disabled="isExpired(order)"
                :loading="payingOrderId === order.id"
                @click="handlePay(order)"
              >
                {{ texts.pay }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="detailVisible"
      :title="texts.detailTitle"
      width="760px"
      :footer="null"
      destroy-on-close
    >
      <div v-if="detailLoading" class="detail-loading">
        <a-spin />
      </div>
      <div v-else-if="detailOrder" class="detail-content">
        <div class="detail-section">
          <h3>{{ texts.detailBase }}</h3>
          <p>{{ texts.orderNoPrefix }}{{ detailOrder.orderNo }}</p>
          <p>{{ texts.statusLabel }}{{ formatStatus(detailOrder) }}</p>
          <p>{{ texts.createTimeLabel }}{{ formatDate(detailOrder.createTime) }}</p>
          <p v-if="detailOrder.expireTime">
            {{ texts.expireTimeLabel }}{{ formatDate(detailOrder.expireTime) }}
          </p>
          <p v-if="detailOrder.payTime">{{ texts.payTimeLabel }}{{ formatDate(detailOrder.payTime) }}</p>
          <p v-if="detailOrder.closeTime">
            {{ texts.closeTimeLabel }}{{ formatDate(detailOrder.closeTime) }}
          </p>
        </div>

        <div class="detail-section">
          <h3>{{ texts.detailAddress }}</h3>
          <p>{{ detailOrder.receiverName }} {{ detailOrder.receiverPhone }}</p>
          <p>
            {{ detailOrder.province }}{{ detailOrder.city }}{{ detailOrder.district
            }}{{ detailOrder.detailAddress }}
          </p>
          <p v-if="detailOrder.remark">{{ texts.remarkLabel }}{{ detailOrder.remark }}</p>
        </div>

        <div
          v-if="detailOrder.orderStatus === ORDER_STATUS_PENDING_PAY"
          class="detail-section detail-countdown"
        >
          <h3>{{ texts.countdownTitle }}</h3>
          <p v-if="isExpired(detailOrder)">{{ texts.expiredPending }}</p>
          <p v-else>{{ texts.remainingLabel }}{{ formatRemaining(detailOrder) }}</p>
        </div>

        <div class="detail-section">
          <h3>{{ texts.detailItems }}</h3>
          <div v-for="item in detailOrder.itemList ?? []" :key="item.id" class="detail-item">
            <div>
              <div class="detail-item-name">{{ item.productName }}</div>
              <div class="detail-item-sub">{{ item.skuName }}</div>
            </div>
            <div class="detail-item-price">
              {{ formatCurrency(item.totalAmount ?? 0) }}
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { message } from "ant-design-vue";
import { getOrderDetail, listMyOrders, mockPayOrder } from "@/api/orderController";
import { resolveAssetUrl } from "@/utils/asset";

const ORDER_STATUS_PENDING_PAY = 0;
const ORDER_STATUS_PAID = 1;
const ORDER_STATUS_CLOSED = 2;

const texts = {
  pageTitle: "我的订单",
  pageSubtitle: "查看已创建订单，并在待支付状态下完成支付。",
  emptyDescription: "您还没有任何订单。",
  goShopping: "开始挑选商品",
  orderNoPrefix: "订单号：",
  noImage: "暂无图片",
  defaultProductName: "未命名商品",
  defaultSkuName: "默认规格",
  quantityPrefix: "数量：",
  totalLabel: "应付总额：",
  remainingLabel: "剩余支付时间：",
  expireTimeLabel: "失效时间：",
  expiredPending: "已失效，等待系统关闭",
  viewDetail: "查看详情",
  pay: "支付",
  detailTitle: "订单详情",
  detailBase: "订单信息",
  detailAddress: "收货信息",
  detailItems: "商品明细",
  countdownTitle: "支付倒计时",
  statusLabel: "订单状态：",
  createTimeLabel: "创建时间：",
  payTimeLabel: "支付时间：",
  closeTimeLabel: "关闭时间：",
  remarkLabel: "订单备注：",
  loadFailed: "订单加载失败",
  detailFailed: "订单详情加载失败",
  paySuccess: "支付成功",
  payFailed: "支付失败",
};

const loading = ref(true);
const orders = ref<API.OrderVO[]>([]);
const nowTs = ref(Date.now());
const payingOrderId = ref<string>();
const detailVisible = ref(false);
const detailLoading = ref(false);
const detailOrder = ref<API.OrderDetailVO>();
const expiredRefreshOrderIds = new Set<string>();
let timer: number | undefined;

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await listMyOrders();
    if (res.code !== 0) {
      throw new Error(res.message || texts.loadFailed);
    }
    orders.value = res.data ?? [];
  } catch (error) {
    orders.value = [];
    message.error(error instanceof Error ? error.message : texts.loadFailed);
  } finally {
    loading.value = false;
  }
};

const viewDetails = async (id?: string) => {
  if (!id) {
    return;
  }
  detailVisible.value = true;
  detailLoading.value = true;
  try {
    const res = await getOrderDetail({ id });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.detailFailed);
    }
    detailOrder.value = res.data;
  } catch (error) {
    detailOrder.value = undefined;
    message.error(error instanceof Error ? error.message : texts.detailFailed);
  } finally {
    detailLoading.value = false;
  }
};

const handlePay = async (order: API.OrderVO) => {
  if (!order.id || payingOrderId.value || isExpired(order)) {
    if (isExpired(order)) {
      message.warning(texts.expiredPending);
      await loadOrders();
    }
    return;
  }
  payingOrderId.value = order.id;
  try {
    const res = await mockPayOrder({ orderId: order.id });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.payFailed);
    }
    message.success(texts.paySuccess);
    if (detailOrder.value?.id === order.id) {
      await viewDetails(order.id);
    }
    await loadOrders();
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.payFailed);
    await loadOrders();
  } finally {
    payingOrderId.value = undefined;
  }
};

const getStatusColor = (order: API.OrderVO | API.OrderDetailVO) => {
  if (order.orderStatus === ORDER_STATUS_PAID) {
    return "success";
  }
  if (order.orderStatus === ORDER_STATUS_PENDING_PAY) {
    return isExpired(order) ? "default" : "warning";
  }
  if (order.orderStatus === ORDER_STATUS_CLOSED) {
    return "default";
  }
  return "processing";
};

const formatStatus = (order: API.OrderVO | API.OrderDetailVO) => {
  if (order.orderStatus === ORDER_STATUS_PENDING_PAY) {
    return isExpired(order) ? "已失效" : "待支付";
  }
  if (order.orderStatus === ORDER_STATUS_PAID) {
    return "已支付";
  }
  if (order.orderStatus === ORDER_STATUS_CLOSED) {
    return "已关闭";
  }
  return "未知状态";
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value?: string) => {
  if (!value) {
    return "--";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatRemaining = (order: API.OrderVO | API.OrderDetailVO) => {
  const remaining = getRemainingMilliseconds(order);
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const getRemainingMilliseconds = (order: API.OrderVO | API.OrderDetailVO) => {
  if (!order.expireTime) {
    return 0;
  }
  const expireTs = new Date(order.expireTime).getTime();
  if (Number.isNaN(expireTs)) {
    return 0;
  }
  return expireTs - nowTs.value;
};

const isExpired = (order: API.OrderVO | API.OrderDetailVO) =>
  order.orderStatus === ORDER_STATUS_PENDING_PAY && getRemainingMilliseconds(order) <= 0;

const startCountdown = () => {
  timer = window.setInterval(() => {
    nowTs.value = Date.now();
    const hasExpiredPendingOrder = orders.value.some((order) => {
      if (!order.id || order.orderStatus !== ORDER_STATUS_PENDING_PAY || !isExpired(order)) {
        return false;
      }
      if (expiredRefreshOrderIds.has(order.id)) {
        return false;
      }
      expiredRefreshOrderIds.add(order.id);
      return true;
    });
    if (hasExpiredPendingOrder) {
      void loadOrders();
    }
  }, 1000);
};

onMounted(async () => {
  await loadOrders();
  startCountdown();
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});
</script>

<style scoped>
.order-page {
  padding: 160px 0 100px;
  background-color: var(--color-bg-main);
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-secondary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.state-wrap,
.empty-orders {
  text-align: center;
  padding: 80px 0;
}

.order-card {
  margin-bottom: 40px;
  padding: 32px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.order-id {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.order-date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.status-tag {
  border-radius: 999px;
  padding: 4px 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.countdown-panel {
  margin-bottom: 22px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(178, 122, 47, 0.1), rgba(143, 95, 31, 0.06));
  border: 1px solid rgba(178, 122, 47, 0.12);
}

.countdown-main,
.countdown-expired {
  font-size: 1rem;
  font-weight: 700;
  color: #8f5f1f;
}

.countdown-expired {
  color: #8a5a44;
}

.countdown-sub {
  margin-top: 8px;
  color: #786a5a;
  font-size: 0.9rem;
}

.order-items {
  margin-bottom: 24px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.item-img {
  width: 72px;
  height: 72px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: #f3ede3 center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b8a76;
  font-size: 0.8rem;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 6px;
  font-size: 1rem;
}

.item-info p {
  margin: 0 0 4px;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.item-attrs {
  color: #8a6030;
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.total-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-info span:first-child {
  color: var(--color-secondary);
  font-size: 0.9rem;
}

.total-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-cta);
}

.order-actions {
  display: flex;
  gap: 12px;
}

.order-action-btn {
  min-width: 112px;
  height: 42px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #b27a2f 0%, #8f5f1f 100%);
  box-shadow: 0 10px 20px rgba(143, 95, 31, 0.18);
  font-weight: 600;
}

.order-action-btn:disabled {
  background: linear-gradient(135deg, #c9b9a2 0%, #b19e8a 100%);
  box-shadow: none;
}

.detail-loading {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-content {
  display: grid;
  gap: 20px;
}

.detail-section h3 {
  margin: 0 0 12px;
  font-size: 1.05rem;
  color: #2a2016;
}

.detail-section p {
  margin: 0 0 8px;
  color: #5f5142;
}

.detail-countdown {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(178, 122, 47, 0.08);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-item:first-of-type {
  border-top: none;
  padding-top: 0;
}

.detail-item-name {
  font-weight: 600;
  color: #2a2016;
}

.detail-item-sub {
  margin-top: 4px;
  color: #786a5a;
  font-size: 0.9rem;
}

.detail-item-price {
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 600px) {
  .container {
    padding: 0 16px;
  }

  .page-header h1 {
    font-size: 2.4rem;
  }

  .order-header,
  .order-footer,
  .order-item,
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-actions {
    width: 100%;
    flex-direction: column;
  }

  .order-actions :deep(.ant-btn) {
    width: 100%;
  }
}
</style>
