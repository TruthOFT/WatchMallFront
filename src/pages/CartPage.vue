<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1>我的购物袋</h1>
      </div>

      <div class="cart-layout">
        <div class="cart-items">
          <div v-if="cartItems.length === 0" class="empty-cart">
            <p>您的购物袋是空的。</p>
            <router-link to="/">
              <a-button type="primary">继续探索系列</a-button>
            </router-link>
          </div>
          
          <div v-else class="items-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item liquid-glass">
              <div class="item-image" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="item-details">
                <h3>{{ item.name }}</h3>
                <p class="item-ref">型号 {{ item.ref }}</p>
                
                <div class="item-controls">
                  <div class="quantity-control">
                    <button @click="updateQuantity(item.id, -1)" :disabled="item.quantity <= 1">-</button>
                    <span class="quantity-value">{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, 1)">+</button>
                  </div>
                  <span class="remove-btn" @click="removeItem(item.id)">移除</span>
                </div>
              </div>
              <div class="item-price-info">
                <div class="item-price">{{ formatCurrency(item.price * item.quantity) }}</div>
                <div v-if="item.quantity > 1" class="unit-price">
                  单价 {{ formatCurrency(item.price) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="glass-panel summary-panel">
            <h3>订单摘要</h3>
            <div class="summary-row">
              <span>小计</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>配送费用</span>
              <span>尊享免运费</span>
            </div>
            <div class="summary-row">
              <span>预估税费</span>
              <span>{{ formatCurrency(tax) }}</span>
            </div>
            <div class="divider"></div>
            <div class="summary-row total">
              <span>总计</span>
              <span>{{ formatCurrency(total) }}</span>
            </div>
            <a-button type="primary" block size="large" class="checkout-btn">前往结算</a-button>
            <p class="secure-note">
              <lock-outlined /> 加密安全结算
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';

const cartItems = ref([
  {
    id: 1,
    name: "皇家橡树离岸型",
    ref: "26420SO.OO.A002CA.01",
    price: 205000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "鹦鹉螺 Ref. 5711",
    ref: "5711/1A-010",
    price: 250000,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "超霸系列登月表",
    ref: "310.30.42.50.01.001",
    price: 54500,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
]);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const tax = computed(() => {
  return subtotal.value * 0.085; 
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const updateQuantity = (id: number, delta: number) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    const newQty = item.quantity + delta;
    if (newQty >= 1) {
      item.quantity = newQty;
    }
  }
};

const removeItem = (id: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
};
</script>

<style scoped>
.cart-page {
  padding: 120px 0 80px;
  background-color: var(--color-bg-main);
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 24px;
}

.page-header h1 {
  font-size: 2.5rem;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.cart-item {
  display: flex;
  padding: 24px;
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.03);
  align-items: center;
}

.item-image {
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  margin-right: 24px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.item-ref {
  color: var(--color-secondary);
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #E5E5E5;
  background: #fff;
}

.quantity-control button {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.quantity-control button:hover:not(:disabled) {
  background: #F5F5F5;
}

.quantity-control button:disabled {
  color: #CCC;
  cursor: not-allowed;
}

.quantity-value {
  width: 40px;
  text-align: center;
  font-family: var(--font-body);
  font-weight: 500;
  border-left: 1px solid #E5E5E5;
  border-right: 1px solid #E5E5E5;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s;
}

.remove-btn:hover {
  color: var(--color-cta);
}

.item-price-info {
  text-align: right;
  min-width: 120px;
}

.item-price {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--color-primary);
}

.unit-price {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.summary-panel {
  padding: 32px;
  background: #fff;
  position: sticky;
  top: 100px;
}

.summary-panel h3 {
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  color: var(--color-secondary);
}

.divider {
  height: 1px;
  background-color: rgba(0,0,0,0.1);
  margin: 24px 0;
}

.total {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.checkout-btn {
  margin-top: 24px;
  margin-bottom: 16px;
}

.secure-note {
  text-align: center;
  font-size: 0.8rem;
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-cart {
  text-align: center;
  padding: 80px 0;
}

.empty-cart p {
  font-size: 1.2rem;
  margin-bottom: 24px;
  color: var(--color-secondary);
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
