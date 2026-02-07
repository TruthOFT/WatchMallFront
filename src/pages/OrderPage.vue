<template>
  <div class="order-page">
    <div class="container">
      <div class="page-header">
        <h1>我的订单</h1>
        <p>追溯您的时计收藏历史。</p>
      </div>

      <div class="orders-list">
        <div v-if="orders.length === 0" class="empty-orders liquid-glass">
          <p>您还没有任何订单。</p>
          <router-link to="/">
            <a-button type="primary">开始您的收藏之旅</a-button>
          </router-link>
        </div>

        <div v-else v-for="order in orders" :key="order.id" class="order-card liquid-glass">
          <div class="order-header">
            <div class="header-left">
              <span class="order-id">订单编号 #{{ order.id }}</span>
              <span class="order-date">{{ order.date }}</span>
            </div>
            <div class="header-right">
              <a-tag :color="getStatusColor(order.status)" class="status-tag">
                {{ formatStatus(order.status) }}
              </a-tag>
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.name" class="order-item">
              <div class="item-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p>数量: {{ item.qty }}</p>
              </div>
              <div class="item-price">
                {{ formatCurrency(item.price) }}
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="total-info">
              <span>应付总额:</span>
              <span class="total-price">{{ formatCurrency(order.total) }}</span>
            </div>
            <div class="order-actions">
              <a-button @click="viewDetails(order.id)">查看详情</a-button>
              <a-button v-if="order.status === 'delivered'" type="primary">再次购买</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const orders = ref([
  {
    id: 'WM-2026-8812',
    date: '2026年2月1日',
    status: 'shipped',
    total: 250000,
    items: [
      {
        name: "鹦鹉螺 Ref. 5711",
        qty: 1,
        price: 250000,
        image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: 'WM-2025-4491',
    date: '2025年12月15日',
    status: 'delivered',
    total: 259500,
    items: [
      {
        name: "超霸系列登月表",
        qty: 1,
        price: 54500,
        image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "皇家橡树离岸型",
        qty: 1,
        price: 205000,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
]);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'success';
    case 'shipped': return 'processing';
    case 'pending': return 'warning';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const formatStatus = (status: string) => {
  const statusMap: any = {
    'delivered': '已送达',
    'shipped': '待收货',
    'pending': '待付款',
    'cancelled': '已取消'
  };
  return statusMap[status] || status;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
};

const viewDetails = (id: string) => {
  message.info(`订单 ${id} 的详细信息功能即将上线`);
};
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

.order-card {
  margin-bottom: 40px;
  padding: 32px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  margin-bottom: 24px;
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
  border-radius: 0;
  padding: 4px 12px;
  font-weight: 600;
  letter-spacing: 1px;
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
  width: 60px;
  height: 60px;
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0,0,0,0.05);
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin-bottom: 4px;
  font-size: 1rem;
}

.item-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
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
  border-top: 1px solid rgba(0,0,0,0.05);
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

.empty-orders {
  text-align: center;
  padding: 80px 0;
}

.empty-orders p {
  font-size: 1.2rem;
  margin-bottom: 24px;
  color: var(--color-secondary);
}

@media (max-width: 600px) {
  .order-footer {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
}
</style>