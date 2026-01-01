<template>
  <div class="cart-page">
    <a-card title="我的购物车" :bordered="false">
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="cartList"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'product'">
            <div class="product-info">
              <img :src="record.image" class="product-img" />
              <div class="product-detail">
                <div class="product-name">{{ record.name }}</div>
                <div class="product-spec">规格：{{ record.spec }}</div>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'quantity'">
            <a-input-number 
              v-model:value="record.quantity" 
              :min="1" 
              @change="updateTotal" 
            />
          </template>

          <template v-else-if="column.key === 'action'">
            <a-popconfirm title="确定要删除吗？" @confirm="onDelete(record.id)">
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>

      <div class="cart-footer">
        <div class="footer-left">
          <span>已选 {{ selectedRowKeys.length }} 件商品</span>
        </div>
        <div class="footer-right">
          <div class="total-price">
            合计：<span class="amount">¥ {{ totalPrice.toFixed(2) }}</span>
          </div>
          <a-button type="primary" size="large" :disabled="selectedRowKeys.length === 0" @click="handleCheckout">
            立即结算
          </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';

const mockData = [
  {
    id: '1',
    name: '精准之路·定制版数据分析手册',
    spec: 'A4精装 / 300页',
    price: 99.00,
    quantity: 1,
    image: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '2',
    name: '高级智能传感器模块',
    spec: 'V2.0 工业级',
    price: 458.50,
    quantity: 2,
    image: 'https://picsum.photos/100/100?random=2'
  },
];

const cartList = ref(mockData);
const selectedRowKeys = ref<string[]>([]); // 存储选中的 ID

const columns = [
  { title: '商品信息', key: 'product', width: '40%' },
  { title: '单价', dataIndex: 'price', customRender: ({ text }: any) => `¥${text.toFixed(2)}` },
  { title: '数量', key: 'quantity' },
  { title: '小计', key: 'subtotal', customRender: ({ record }: any) => `¥${(record.price * record.quantity).toFixed(2)}` },
  { title: '操作', key: 'action' },
];

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => selectedRowKeys.value.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
}));

const onDelete = (id: string) => {
  cartList.value = cartList.value.filter(item => item.id !== id);
  selectedRowKeys.value = selectedRowKeys.value.filter(key => key !== id);
  message.success('已移出购物车');
};

const updateTotal = () => {
  console.log('数量已更新', cartList.value);
};

const handleCheckout = () => {
  message.loading('订单生成中...', 1.5).then(() => {
    message.success('已跳转至支付页面');
  });
};
</script>

<style scoped>
.cart-page {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.product-name {
  font-weight: bold;
  color: #333;
}

.product-spec {
  font-size: 12px;
  color: #999;
}

.cart-footer {
  margin-top: 24px;
  padding: 16px 24px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.total-price {
  font-size: 16px;
  margin-right: 24px;
  display: inline-block;
}

.amount {
  color: #ff4d4f;
  font-size: 22px;
  font-weight: bold;
}

.footer-right {
  display: flex;
  align-items: center;
}
</style>