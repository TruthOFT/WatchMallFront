<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1>{{ texts.pageTitle }}</h1>
        <p class="page-subtitle">{{ texts.pageSubtitle }}</p>
      </div>

      <div v-if="loading" class="state-wrap">
        <a-spin size="large" />
      </div>

      <template v-else>
        <div v-if="cartItems.length === 0" class="empty-cart">
          <a-empty :description="texts.emptyDescription" />
          <router-link to="/">
            <a-button type="primary" size="large">{{ texts.continueShopping }}</a-button>
          </router-link>
        </div>

        <div v-else class="cart-layout">
          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item"
              :class="{ disabled: isPending(item.id) || checkoutLoading }"
            >
              <div class="item-check">
                <a-checkbox
                  :checked="item.checked === 1"
                  :disabled="isPending(item.id) || checkoutLoading"
                  @change="handleCheckedChange(item, $event.target.checked)"
                />
              </div>

              <div
                class="item-image"
                :style="{
                  backgroundImage: item.image ? `url(${item.image})` : undefined,
                }"
              >
                <span v-if="!item.image" class="image-placeholder">
                  {{ texts.noImage }}
                </span>
              </div>

              <div class="item-details">
                <h3>{{ item.productName || texts.defaultProductName }}</h3>
                <p v-if="item.productTitle" class="item-subtitle">{{ item.productTitle }}</p>
                <p class="item-spec">{{ item.skuName || texts.defaultSpec }}</p>

                <div class="item-controls">
                  <div class="quantity-control">
                    <button
                      type="button"
                      :disabled="isPending(item.id) || checkoutLoading || (item.quantity ?? 1) <= 1"
                      @click="updateQuantity(item, -1)"
                    >
                      -
                    </button>
                    <span class="quantity-value">{{ item.quantity ?? 1 }}</span>
                    <button
                      type="button"
                      :disabled="
                        isPending(item.id) ||
                        checkoutLoading ||
                        (item.quantity ?? 0) >= (item.stock ?? 0)
                      "
                      @click="updateQuantity(item, 1)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    class="remove-btn"
                    :disabled="isPending(item.id) || checkoutLoading"
                    @click="removeItem(item)"
                  >
                    {{ texts.remove }}
                  </button>
                </div>
              </div>

              <div class="item-price-info">
                <div class="item-price">
                  {{ formatCurrency((item.price ?? 0) * (item.quantity ?? 0)) }}
                </div>
                <div class="unit-price">
                  {{ texts.unitPrice }} {{ formatCurrency(item.price ?? 0) }}
                </div>
                <div class="stock">
                  {{ texts.stockPrefix }} {{ item.stock ?? 0 }}
                </div>
              </div>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-panel">
              <h3>{{ texts.summaryTitle }}</h3>
              <div class="summary-row">
                <span>{{ texts.selectedCount }}</span>
                <span>{{ checkedCount }}</span>
              </div>
              <div class="summary-row">
                <span>{{ texts.totalCount }}</span>
                <span>{{ totalCount }}</span>
              </div>
              <div class="divider"></div>
              <div class="summary-row total">
                <span>{{ texts.subtotal }}</span>
                <span>{{ formatCurrency(checkedAmount) }}</span>
              </div>
              <a-button
                type="primary"
                block
                size="large"
                class="checkout-btn"
                :disabled="checkedCount === 0 || checkoutLoading"
                :loading="checkoutLoading"
                @click="handleCheckout"
              >
                {{ texts.checkout }}
              </a-button>
              <p class="summary-tip">{{ texts.summaryTip }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import {
  deleteCartItem,
  getMyCart,
  updateCartItemChecked,
  updateCartItemQuantity,
} from "@/api/cartController";
import { checkoutOrder } from "@/api/orderController";
import { resolveAssetUrl } from "@/utils/asset";

const router = useRouter();

const texts = {
  pageTitle: "我的购物车",
  pageSubtitle: "在这里检查已选商品、规格与数量。",
  emptyDescription: "您的购物车还是空的",
  continueShopping: "继续选购",
  noImage: "暂无图片",
  defaultProductName: "未命名商品",
  defaultSpec: "默认规格",
  remove: "移除",
  unitPrice: "单价",
  stockPrefix: "库存",
  summaryTitle: "购物车汇总",
  selectedCount: "已选件数",
  totalCount: "商品总数",
  subtotal: "小计",
  checkout: "去结算",
  summaryTip: "下单后可在订单页完成模拟支付。",
  loadFailed: "购物车加载失败",
  updateFailed: "购物车更新失败",
  removeSuccess: "已从购物车移除",
  checkoutSuccess: "订单已创建，请前往订单页完成支付",
  checkoutFailed: "结算失败，请稍后重试",
};

const loading = ref(true);
const checkoutLoading = ref(false);
const cartItems = ref<API.CartItemVO[]>([]);
const pendingItemIds = ref<string[]>([]);

const checkedAmount = computed(() =>
  cartItems.value.reduce((sum, item) => {
    if (item.checked !== 1) {
      return sum;
    }
    return sum + (item.price ?? 0) * (item.quantity ?? 0);
  }, 0)
);

const checkedCount = computed(() =>
  cartItems.value.reduce((sum, item) => {
    if (item.checked !== 1) {
      return sum;
    }
    return sum + (item.quantity ?? 0);
  }, 0)
);

const totalCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
);

const normalizeItem = (item: API.CartItemVO): API.CartItemVO => ({
  ...item,
  image: resolveAssetUrl(item.image),
  checked: item.checked ?? 1,
  quantity: item.quantity ?? 1,
  stock: item.stock ?? 0,
});

const setPending = (id: string | undefined, active: boolean) => {
  if (!id) {
    return;
  }
  if (active) {
    if (!pendingItemIds.value.includes(id)) {
      pendingItemIds.value = [...pendingItemIds.value, id];
    }
    return;
  }
  pendingItemIds.value = pendingItemIds.value.filter((itemId) => itemId !== id);
};

const isPending = (id?: string) => !!id && pendingItemIds.value.includes(id);

const loadCart = async () => {
  loading.value = true;
  try {
    const res = await getMyCart();
    if (res.code !== 0) {
      throw new Error(res.message || texts.loadFailed);
    }
    cartItems.value = (res.data?.itemList ?? []).map(normalizeItem);
  } catch (error) {
    cartItems.value = [];
    message.error(error instanceof Error ? error.message : texts.loadFailed);
  } finally {
    loading.value = false;
  }
};

const updateQuantity = async (item: API.CartItemVO, delta: number) => {
  if (!item.id) {
    return;
  }
  const nextQuantity = (item.quantity ?? 1) + delta;
  if (nextQuantity < 1 || nextQuantity > (item.stock ?? 0)) {
    return;
  }

  setPending(item.id, true);
  try {
    const res = await updateCartItemQuantity({
      id: item.id,
      quantity: nextQuantity,
    });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.updateFailed);
    }
    item.quantity = nextQuantity;
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.updateFailed);
  } finally {
    setPending(item.id, false);
  }
};

const handleCheckedChange = async (item: API.CartItemVO, checked: boolean) => {
  if (!item.id) {
    return;
  }

  const targetValue = checked ? 1 : 0;
  setPending(item.id, true);
  try {
    const res = await updateCartItemChecked({
      id: item.id,
      checked: targetValue,
    });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.updateFailed);
    }
    item.checked = targetValue;
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.updateFailed);
  } finally {
    setPending(item.id, false);
  }
};

const removeItem = async (item: API.CartItemVO) => {
  if (!item.id) {
    return;
  }

  setPending(item.id, true);
  try {
    const res = await deleteCartItem({ id: item.id });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.updateFailed);
    }
    cartItems.value = cartItems.value.filter((current) => current.id !== item.id);
    message.success(texts.removeSuccess);
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.updateFailed);
  } finally {
    setPending(item.id, false);
  }
};

const handleCheckout = async () => {
  if (checkedCount.value === 0 || checkoutLoading.value) {
    return;
  }

  checkoutLoading.value = true;
  try {
    const res = await checkoutOrder({});
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.checkoutFailed);
    }
    message.success(texts.checkoutSuccess);
    await loadCart();
    await router.push("/user/orders");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : texts.checkoutFailed;
    message.error(errorMessage);
    if (errorMessage.includes("默认地址")) {
      await router.push("/user/settings");
    }
  } finally {
    checkoutLoading.value = false;
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

onMounted(() => {
  void loadCart();
});
</script>

<style scoped>
.cart-page {
  padding: 120px 0 80px;
  min-height: 80vh;
  background:
    radial-gradient(circle at top left, rgba(201, 165, 92, 0.18), transparent 30%),
    linear-gradient(180deg, #f8f5ef 0%, #f2eee7 100%);
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 36px;
}

.page-header h1 {
  margin: 0;
  font-size: 2.6rem;
  color: #21180f;
}

.page-subtitle {
  margin: 12px 0 0;
  color: #6f6254;
}

.state-wrap,
.empty-cart {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(320px, 0.9fr);
  gap: 32px;
  align-items: start;
}

.cart-items,
.summary-panel {
  border-radius: 28px;
  border: 1px solid rgba(109, 84, 53, 0.08);
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 20px 50px rgba(50, 38, 21, 0.08);
  backdrop-filter: blur(16px);
}

.cart-items {
  padding: 10px 18px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 120px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid rgba(109, 84, 53, 0.08);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item.disabled {
  opacity: 0.65;
}

.item-check {
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background: #ece2d4 center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  color: #8d7760;
  font-size: 0.9rem;
}

.item-details h3 {
  margin: 0;
  font-size: 1.22rem;
  color: #21180f;
}

.item-subtitle,
.item-spec,
.unit-price,
.stock {
  margin: 8px 0 0;
  color: #786a5a;
}

.attribute-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.attribute-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(157, 107, 38, 0.08);
  color: #7e5420;
  font-size: 0.86rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 18px;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(109, 84, 53, 0.14);
  border-radius: 999px;
  overflow: hidden;
  background: #fff;
}

.quantity-control button {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
}

.quantity-control button:disabled,
.remove-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-value {
  min-width: 44px;
  text-align: center;
  font-weight: 600;
  color: #21180f;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #9a6b2c;
  cursor: pointer;
  text-decoration: underline;
}

.item-price-info {
  min-width: 140px;
  text-align: right;
}

.item-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #9d6b26;
}

.summary-panel {
  padding: 28px;
  position: sticky;
  top: 120px;
}

.summary-panel h3 {
  margin: 0 0 24px;
  font-size: 1.4rem;
  color: #21180f;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  color: #574838;
}

.summary-row.total {
  font-size: 1.08rem;
  font-weight: 700;
  color: #21180f;
}

.divider {
  height: 1px;
  margin: 18px 0;
  background: rgba(109, 84, 53, 0.1);
}

.checkout-btn {
  height: 48px;
  margin-top: 10px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #b27a2f 0%, #8f5f1f 100%);
  box-shadow: 0 12px 24px rgba(143, 95, 31, 0.22);
}

.summary-tip {
  margin: 14px 0 0;
  color: #7b6b59;
  line-height: 1.7;
}

@media (max-width: 960px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary-panel {
    position: static;
  }

  .cart-item {
    grid-template-columns: auto 100px 1fr;
  }

  .item-price-info {
    grid-column: 2 / 4;
    text-align: left;
    margin-left: 2px;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 16px;
  }

  .page-header h1 {
    font-size: 2.2rem;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-check {
    justify-content: flex-start;
  }

  .item-image {
    width: 100%;
    height: 220px;
  }

  .item-price-info {
    grid-column: auto;
  }

  .item-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
