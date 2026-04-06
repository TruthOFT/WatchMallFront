<template>
  <div class="favorite-page">
    <div class="container favorite-container">
      <div class="page-header">
        <p class="eyebrow">favorite list</p>
        <h1>我的收藏</h1>
        <p>集中查看你收藏过的腕表，支持快速进入详情或直接取消收藏。</p>
      </div>

      <div v-if="loading" class="state-wrap">
        <a-spin size="large" />
      </div>

      <a-empty v-else-if="favoriteList.length === 0" class="empty-state">
        <template #description>
          <span>还没有收藏任何商品</span>
        </template>
        <a-button type="primary" @click="router.push('/')">去逛逛</a-button>
      </a-empty>

      <div v-else class="favorite-list">
        <article
          v-for="item in favoriteList"
          :key="item.productId"
          class="favorite-row"
        >
          <button
            type="button"
            class="image-button"
            @click="goToProduct(item.productId)"
          >
            <span
              class="product-image"
              :style="{
                backgroundImage: item.url ? `url(${item.url})` : undefined,
              }"
            />
          </button>

          <div class="product-info">
            <h2>{{ item.name || "未命名商品" }}</h2>
            <p class="favorite-title">{{ item.title || "暂无商品标题" }}</p>
            <p class="favorite-time">
              收藏时间：{{ formatDateTime(item.favoriteTime) }}
            </p>
          </div>

          <div class="price-info">
            <span class="label">价格</span>
            <strong>{{ formatPrice(item.price) }}</strong>
          </div>

          <div class="action-row">
            <a-button class="action-button" @click="goToProduct(item.productId)">
              查看商品
            </a-button>
            <a-button
              class="action-button danger-button"
              :loading="removingId === item.productId"
              @click="handleRemove(item)"
            >
              取消收藏
            </a-button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { listMyFavorites, removeFavorite } from "@/api/favoriteController";
import { resolveAssetUrl } from "@/utils/asset";

const router = useRouter();

const loading = ref(true);
const removingId = ref<string>();
const favoriteList = ref<API.FavoriteProductVO[]>([]);

const formatPrice = (price?: number) => {
  if (typeof price !== "number") {
    return "价格待定";
  }
  return `¥${price.toFixed(2)}`;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return "暂无记录";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

const goToProduct = (productId?: string) => {
  if (!productId) {
    return;
  }
  void router.push(`/product/${productId}`);
};

const loadFavorites = async () => {
  loading.value = true;
  try {
    const res = await listMyFavorites();
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || "加载收藏失败");
    }
    favoriteList.value = (res.data ?? []).map((item) => ({
      ...item,
      url: resolveAssetUrl(item.url),
    }));
  } catch (error) {
    favoriteList.value = [];
    message.error(error instanceof Error ? error.message : "加载收藏失败");
  } finally {
    loading.value = false;
  }
};

const handleRemove = async (item: API.FavoriteProductVO) => {
  if (!item.productId) {
    return;
  }
  removingId.value = item.productId;
  try {
    const res = await removeFavorite({ productId: item.productId });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || "取消收藏失败");
    }
    favoriteList.value = favoriteList.value.filter(
      (favorite) => favorite.productId !== item.productId
    );
    message.success("已取消收藏");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "取消收藏失败");
  } finally {
    removingId.value = undefined;
  }
};

onMounted(() => {
  void loadFavorites();
});
</script>

<style scoped>
.favorite-page {
  min-height: 100vh;
  padding: 140px 0 80px;
  background:
    radial-gradient(circle at top left, rgba(201, 165, 92, 0.16), transparent 28%),
    linear-gradient(180deg, #f8f5ef 0%, #f2eee7 100%);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.favorite-container {
  min-height: 60vh;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 10px 0 12px;
  font-size: 3rem;
  color: #20180f;
}

.page-header p {
  margin: 0;
  max-width: 720px;
  color: #6b5f52;
  line-height: 1.8;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  color: #8e7248;
}

.state-wrap,
.empty-state {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.favorite-row {
  display: flex;
  align-items: center;
  gap: 22px;
  border: 1px solid rgba(109, 84, 53, 0.12);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 18px 44px rgba(63, 43, 18, 0.08);
  backdrop-filter: blur(16px);
  padding: 18px 20px;
}

.image-button {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.product-image {
  display: block;
  width: 120px;
  height: 120px;
  background-color: #f8f3ea;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h2 {
  margin: 0 0 10px;
  font-size: 1.3rem;
  color: #241c13;
}

.favorite-title {
  margin: 0 0 12px;
  color: #6b5f52;
  line-height: 1.7;
}

.favorite-time {
  margin: 0;
  color: #8c7a63;
  font-size: 0.88rem;
}

.price-info {
  display: flex;
  min-width: 120px;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.price-info .label {
  color: #8c7a63;
  font-size: 0.85rem;
}

.price-info strong {
  color: #9d6b26;
  font-size: 1.18rem;
  font-weight: 700;
}

.action-row {
  display: flex;
  flex-shrink: 0;
  gap: 12px;
}

.action-button {
  height: 44px;
  border-radius: 999px;
  border-color: rgba(157, 107, 38, 0.28);
  color: #8f5f1f;
}

.action-button:hover,
.action-button:focus {
  border-color: #9d6b26;
  color: #9d6b26;
}

.danger-button {
  background: linear-gradient(135deg, #fff5f2 0%, #fff 100%);
}

@media (max-width: 640px) {
  .favorite-page {
    padding-top: 120px;
  }

  .container {
    padding: 0 16px;
  }

  .page-header h1 {
    font-size: 2.3rem;
  }

  .favorite-row {
    flex-direction: column;
    align-items: stretch;
  }

  .product-image {
    width: 100%;
    height: 220px;
  }

  .price-info {
    min-width: 0;
  }

  .action-row {
    flex-direction: column;
  }
}
</style>
