<template>
  <div class="product-detail-page">
    <div class="container detail-container">
      <div v-if="loading" class="state-wrap">
        <a-spin size="large" />
      </div>
      <a-result
        v-else-if="notFound"
        status="404"
        :title="texts.notFoundTitle"
        :sub-title="texts.notFoundSubtitle"
      >
        <template #extra>
          <a-button type="primary" @click="router.push('/')">
            {{ texts.backHome }}
          </a-button>
        </template>
      </a-result>
      <template v-else-if="product">
        <section class="hero-card">
          <div class="gallery-panel">
            <div
              class="main-image"
              :style="{
                backgroundImage: primaryImage
                  ? `url(${primaryImage})`
                  : undefined,
              }"
            >
              <div v-if="!primaryImage" class="image-placeholder">
                {{ texts.noImage }}
              </div>
            </div>
            <div v-if="thumbnailImages.length" class="thumb-grid">
              <button
                v-for="image in thumbnailImages"
                :key="image.key"
                type="button"
                :class="['thumb-card', { active: currentImage === image.url }]"
                @click="handleSelectImage(image)"
              >
                <span
                  class="thumb-image"
                  :style="{
                    backgroundImage: image.url
                      ? `url(${image.url})`
                      : undefined,
                  }"
                />
                <span v-if="image.tag" class="thumb-tag">{{ image.tag }}</span>
              </button>
            </div>
          </div>

          <div class="content-panel">
            <div class="content-top">
              <div v-if="product.categoryList?.length" class="category-tags">
                <span
                  v-for="category in product.categoryList"
                  :key="category.id"
                  class="category-pill"
                >
                  {{ category.name }}
                </span>
              </div>
              <h1>{{ product.name || texts.unnamedProduct }}</h1>
              <p v-if="product.title" class="subtitle">{{ product.title }}</p>
              <div class="price-wrap">
                <p class="price">{{ formatPrice(displayPrice) }}</p>
                <span v-if="displayMarketPrice" class="market-price">
                  {{ formatPrice(displayMarketPrice) }}
                </span>
              </div>
              <p v-if="product.description" class="description">
                {{ product.description }}
              </p>
            </div>

            <section class="section-card spec-section">
              <h2>{{ texts.currentSpec }}</h2>
              <p class="spec-name">{{ selectedSkuName }}</p>
              <p class="spec-empty">{{ texts.noSpecDescription }}</p>
            </section>

            <section class="section-card action-section">
              <h2>{{ texts.purchaseAction }}</h2>
              <div class="action-row">
                <a-button
                  size="large"
                  class="favorite-button"
                  :class="{ active: hasFavorite }"
                  :loading="favoriteLoading"
                  @click="handleToggleFavorite"
                >
                  {{ hasFavorite ? texts.favorited : texts.favorite }}
                </a-button>
                <a-button
                  type="primary"
                  size="large"
                  class="cart-button"
                  :loading="addingToCart"
                  :disabled="!canAddToCart"
                  @click="handleAddToCart"
                >
                  {{ texts.addToCart }}
                </a-button>
              </div>
              <p class="action-tip">
                {{ canAddToCart ? texts.actionTip : texts.noSkuTip }}
              </p>
            </section>

            <section v-if="featureList.length" class="section-card">
              <h2>{{ texts.featureTitle }}</h2>
              <div class="feature-grid">
                <div
                  v-for="(feature, index) in featureList"
                  :key="`${feature.label}-${index}`"
                  class="feature-item"
                >
                  <span class="feature-label">
                    {{ feature.label || texts.defaultFeatureLabel }}
                  </span>
                  <strong>{{
                    feature.value || texts.noFeatureDescription
                  }}</strong>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section v-if="!notFound" class="related-section">
          <div class="related-header">
            <div>
              <p class="related-eyebrow">{{ texts.relatedEyebrow }}</p>
              <h2>{{ texts.relatedTitle }}</h2>
            </div>
          </div>

          <div v-if="relatedLoading" class="related-loading">
            <a-spin />
          </div>
          <div v-else class="related-grid">
            <button
              v-for="item in relatedProducts"
              :key="item.id"
              type="button"
              class="related-card"
              @click="goToProduct(item.id)"
            >
              <span
                class="related-image"
                :style="{ backgroundImage: item.url ? `url(${item.url})` : undefined }"
              />
              <span class="related-name">
                {{ item.name || texts.unnamedProduct }}
              </span>
              <span class="related-price">{{ formatPrice(item.price) }}</span>
            </button>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { addCart } from "@/api/cartController";
import {
  addFavorite,
  getFavoriteStatus,
  removeFavorite,
} from "@/api/favoriteController";
import {
  getProductDetail,
  listRelatedProducts,
  trackProductView,
} from "@/api/productController";
import { useUserStore } from "@/config/stores";
import { resolveAssetUrl } from "@/utils/asset";
import { normalizeRouteId } from "@/utils/route";

type ResolvedSku = API.ProductSkuVO & {
  key: string;
  image: string;
};

type ThumbnailItem = {
  key: string;
  url: string;
  tag?: string;
  skuKey?: string;
};

const texts = {
  notFoundTitle: "商品未找到",
  notFoundSubtitle: "该商品可能已下架，或暂时不可查看。",
  backHome: "返回首页",
  noImage: "暂无图片",
  unnamedProduct: "未命名商品",
  currentSpec: "当前规格",
  defaultSpec: "默认规格",
  noSpecDescription: "当前商品暂无更多规格说明。",
  purchaseAction: "购买操作",
  addToCart: "加入购物车",
  favorite: "收藏",
  favorited: "已收藏",
  favoriteLoginTip: "请先登录后再收藏",
  favoriteAdded: "收藏成功",
  favoriteRemoved: "已取消收藏",
  favoriteFailed: "收藏操作失败",
  actionTip: "支持加入购物车，也可以先收藏后再决定。",
  noSkuTip: "当前商品暂无可加入购物车的规格。",
  featureTitle: "产品亮点",
  defaultFeatureLabel: "特性",
  noFeatureDescription: "暂无说明",
  skuImageTag: "规格图",
  mainImageTag: "主图",
  detailImageTag: "详情图",
  currentProduct: "当前商品",
  cartSuccess: "已加入购物车",
  cartFailed: "加入购物车失败",
  pricePending: "价格待定",
  relatedEyebrow: "recommendation",
  relatedTitle: "猜你喜欢",
};

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const notFound = ref(false);
const product = ref<API.ProductDetailVO>();
const currentImage = ref("");
const selectedSkuKey = ref("");
const addingToCart = ref(false);
const favoriteLoading = ref(false);
const hasFavorite = ref(false);
const relatedLoading = ref(false);
const relatedProducts = ref<API.ProductVO[]>([]);

const galleryImages = computed(() =>
  (product.value?.imageList ?? []).map((image, index) => ({
    ...image,
    id: image.id ?? `gallery-${index}`,
    url: resolveAssetUrl(image.url),
  }))
);

const featureList = computed(() => product.value?.featureLst ?? []);

const skuList = computed<ResolvedSku[]>(() =>
  (product.value?.skuList ?? []).map((sku, index) => ({
    ...sku,
    key: sku.id ?? sku.skuCode ?? `sku-${index}`,
    image: resolveAssetUrl(sku.image),
  }))
);

const currentSku = computed<ResolvedSku | undefined>(() => {
  const matchedSku = skuList.value.find(
    (sku) => sku.key === selectedSkuKey.value
  );
  return matchedSku ?? skuList.value[0];
});

const displayPrice = computed(
  () => currentSku.value?.price ?? product.value?.price
);

const displayMarketPrice = computed(() => currentSku.value?.marketPrice);

const selectedSkuName = computed(
  () => currentSku.value?.skuName || texts.defaultSpec
);

const canAddToCart = computed(() => !!currentSku.value?.id);

const thumbnailImages = computed<ThumbnailItem[]>(() => {
  const result: ThumbnailItem[] = [];
  const seen = new Set<string>();

  const pushThumbnail = (item: ThumbnailItem | null) => {
    if (!item?.url || seen.has(item.url)) {
      return;
    }
    seen.add(item.url);
    result.push(item);
  };

  skuList.value.forEach((sku) => {
    pushThumbnail({
      key: `sku-${sku.key}`,
      url: sku.image,
      tag: sku.skuName || texts.skuImageTag,
      skuKey: sku.key,
    });
  });

  pushThumbnail({
    key: "product-main",
    url: resolveAssetUrl(product.value?.mainUrl),
    tag: texts.mainImageTag,
  });

  galleryImages.value.forEach((image, index) => {
    pushThumbnail({
      key: image.id ?? `gallery-${index}`,
      url: image.url ?? "",
      tag: texts.detailImageTag,
    });
  });

  return result;
});

const primaryImage = computed(() => {
  return (
    currentImage.value ||
    currentSku.value?.image ||
    resolveAssetUrl(product.value?.mainUrl) ||
    thumbnailImages.value[0]?.url ||
    ""
  );
});

const syncSelectionState = () => {
  const firstSku = skuList.value[0];
  selectedSkuKey.value = firstSku?.key ?? "";
  currentImage.value =
    firstSku?.image ||
    resolveAssetUrl(product.value?.mainUrl) ||
    thumbnailImages.value[0]?.url ||
    "";
};

const handleSelectImage = (image: ThumbnailItem) => {
  currentImage.value = image.url;
  if (image.skuKey) {
    selectedSkuKey.value = image.skuKey;
  }
};

const goToProduct = (productId?: string | number | null) => {
  const nextId = normalizeRouteId(productId);
  if (!nextId) {
    return;
  }
  void router.push(`/product/${nextId}`);
};

const handleAddToCart = async () => {
  if (!currentSku.value?.id) {
    message.warning(texts.noSkuTip);
    return;
  }

  addingToCart.value = true;
  try {
    const res = await addCart({
      skuId: currentSku.value.id,
      quantity: 1,
    });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.cartFailed);
    }
    const productName = product.value?.name || texts.currentProduct;
    const specName = currentSku.value?.skuName;
    const summary = specName ? `${productName} (${specName})` : productName;
    message.success(`${summary} ${texts.cartSuccess}`);
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.cartFailed);
  } finally {
    addingToCart.value = false;
  }
};

const syncFavoriteStatus = async (productId: string) => {
  if (!userStore.isLogin) {
    hasFavorite.value = false;
    return;
  }
  try {
    const res = await getFavoriteStatus({ productId });
    hasFavorite.value = res.code === 0 && !!res.data?.hasFavorite;
  } catch (error) {
    hasFavorite.value = false;
  }
};

const handleToggleFavorite = async () => {
  const productId = normalizeRouteId(product.value?.id);
  if (!productId) {
    return;
  }
  if (!userStore.isLogin) {
    message.warning(texts.favoriteLoginTip);
    void router.push({
      path: "/user/login",
      query: { redirect: route.fullPath },
    });
    return;
  }

  favoriteLoading.value = true;
  try {
    const request = hasFavorite.value ? removeFavorite : addFavorite;
    const res = await request({ productId });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || texts.favoriteFailed);
    }
    hasFavorite.value = !hasFavorite.value;
    message.success(hasFavorite.value ? texts.favoriteAdded : texts.favoriteRemoved);
  } catch (error) {
    message.error(error instanceof Error ? error.message : texts.favoriteFailed);
  } finally {
    favoriteLoading.value = false;
  }
};

const resolveDeviceType = () => {
  if (typeof window === "undefined") {
    return "pc";
  }
  return window.innerWidth <= 768 ? "h5" : "pc";
};

const loadRelatedProductList = async (productId: string) => {
  relatedLoading.value = true;
  try {
    const res = await listRelatedProducts({ id: productId, size: "6" });
    if (res.code !== 0 || !res.data) {
      relatedProducts.value = [];
      return;
    }
    relatedProducts.value = (res.data ?? [])
      .slice(0, 5)
      .map((item) => ({
        ...item,
        url: resolveAssetUrl(item.url),
      }));
  } catch (error) {
    relatedProducts.value = [];
  } finally {
    relatedLoading.value = false;
  }
};

const trackCurrentProductView = async (productId: string) => {
  try {
    await trackProductView({
      productId,
      viewSource: "detail",
      deviceType: resolveDeviceType(),
    });
  } catch (error) {
    console.log(error);
  }
};

const formatPrice = (price?: number) => {
  if (typeof price !== "number") {
    return texts.pricePending;
  }
  return `¥${price.toFixed(2)}`;
};

const loadProductDetail = async () => {
  const productId = normalizeRouteId(
    route.params.id as string | string[] | undefined
  );

  if (!productId) {
    loading.value = false;
    notFound.value = true;
    product.value = undefined;
    selectedSkuKey.value = "";
    currentImage.value = "";
    hasFavorite.value = false;
    relatedProducts.value = [];
    return;
  }

  loading.value = true;
  notFound.value = false;

  try {
    const res = await getProductDetail({ id: productId });
    if (res.code !== 0 || !res.data) {
      throw new Error(res.message || "product not found");
    }

    product.value = {
      ...res.data,
      mainUrl: resolveAssetUrl(res.data.mainUrl),
      imageList: (res.data.imageList ?? []).map((image) => ({
        ...image,
        url: resolveAssetUrl(image.url),
      })),
    };
    syncSelectionState();
    void loadRelatedProductList(productId);
    void trackCurrentProductView(productId);
    void syncFavoriteStatus(productId);
  } catch (error) {
    product.value = undefined;
    selectedSkuKey.value = "";
    currentImage.value = "";
    hasFavorite.value = false;
    notFound.value = true;
    relatedProducts.value = [];
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.id,
  () => {
    void loadProductDetail();
  },
  { immediate: true }
);
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 140px 0 80px;
  background: radial-gradient(
      circle at top left,
      rgba(201, 165, 92, 0.18),
      transparent 28%
    ),
    linear-gradient(180deg, #f8f5ef 0%, #f2eee7 100%);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.detail-container {
  min-height: 60vh;
}

.state-wrap {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 40px;
  align-items: start;
}

.related-section {
  margin-top: 48px;
  padding: 32px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 60px rgba(73, 49, 17, 0.08);
  backdrop-filter: blur(16px);
}

.related-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.related-eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  color: #8e7248;
}

.related-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #20180f;
}

.related-loading {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
}

.related-card {
  padding: 0;
  border: 1px solid rgba(109, 84, 53, 0.1);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.related-card:hover {
  transform: translateY(-4px);
  border-color: rgba(157, 107, 38, 0.3);
  box-shadow: 0 18px 40px rgba(83, 58, 26, 0.14);
}

.related-image {
  display: block;
  width: 100%;
  padding-top: 78%;
  background-size: cover;
  background-position: center;
  background-color: #f8f3ea;
}

.related-name,
.related-price {
  display: block;
  padding: 0 16px;
}

.related-name {
  margin-top: 16px;
  color: #241c13;
  font-size: 0.98rem;
  line-height: 1.5;
}

.related-price {
  margin: 10px 0 18px;
  color: #9d6b26;
  font-weight: 700;
}

.gallery-panel,
.content-panel {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(109, 84, 53, 0.08);
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(50, 38, 21, 0.08);
  backdrop-filter: blur(16px);
}

.gallery-panel {
  padding: 24px;
}

.main-image {
  min-height: 560px;
  border-radius: 22px;
  background-color: #ebe3d5;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.image-placeholder {
  min-height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #81633f;
}

.thumb-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: 12px;
}

.thumb-card {
  position: relative;
  padding: 0;
  border: 1px solid rgba(109, 84, 53, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.thumb-card.active,
.thumb-card:hover {
  transform: translateY(-2px);
  border-color: rgba(163, 117, 39, 0.5);
  box-shadow: 0 12px 24px rgba(83, 58, 26, 0.14);
}

.thumb-image {
  display: block;
  width: 100%;
  padding-top: 100%;
  background-size: cover;
  background-position: center;
}

.thumb-tag {
  position: absolute;
  right: 8px;
  bottom: 8px;
  max-width: calc(100% - 16px);
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(32, 24, 15, 0.72);
  color: #fff;
  font-size: 0.72rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-panel {
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-top h1 {
  margin: 16px 0 12px;
  font-size: 3rem;
  line-height: 1.05;
  color: #20180f;
}

.subtitle {
  margin: 0 0 18px;
  font-size: 1.1rem;
  color: #6b5f52;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin-bottom: 20px;
}

.price {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #9d6b26;
}

.market-price {
  color: #a79a8b;
  font-size: 1rem;
  text-decoration: line-through;
}

.description {
  margin: 0;
  line-height: 1.9;
  color: #4b4034;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-pill,
.attribute-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(157, 107, 38, 0.08);
  color: #7e5420;
  font-size: 0.92rem;
}

.section-card {
  padding-top: 6px;
  border-top: 1px solid rgba(109, 84, 53, 0.1);
}

.section-card h2 {
  margin: 0 0 18px;
  font-size: 1.2rem;
  color: #241c13;
}

.spec-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.spec-name {
  margin: -8px 0 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2a2118;
}

.spec-empty {
  margin: 0;
  color: #7b6b59;
  line-height: 1.8;
}

.attribute-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.cart-button {
  min-width: 180px;
  height: 48px;
  border-radius: 999px;
  background: linear-gradient(135deg, #b27a2f 0%, #8f5f1f 100%);
  border: none;
  box-shadow: 0 12px 24px rgba(143, 95, 31, 0.22);
}

.cart-button:hover,
.cart-button:focus {
  background: linear-gradient(135deg, #c68833 0%, #9d6b26 100%);
}

.favorite-button {
  min-width: 148px;
  height: 48px;
  border-radius: 999px;
  border-color: rgba(157, 107, 38, 0.26);
  color: #8f5f1f;
  background: rgba(255, 255, 255, 0.82);
}

.favorite-button:hover,
.favorite-button:focus {
  border-color: #9d6b26;
  color: #9d6b26;
}

.favorite-button.active {
  border-color: rgba(157, 107, 38, 0.18);
  background: rgba(157, 107, 38, 0.12);
  color: #8f5f1f;
}

.action-tip {
  margin: 0;
  color: #7b6b59;
  line-height: 1.7;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.feature-item {
  padding: 18px;
  border-radius: 20px;
  background: #f8f3ea;
}

.feature-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: #8c7a63;
}

.feature-item strong {
  color: #2a2118;
}

@media (max-width: 960px) {
  .hero-card {
    grid-template-columns: 1fr;
  }

  .main-image,
  .image-placeholder {
    min-height: 420px;
  }

  .content-top h1 {
    font-size: 2.4rem;
  }

  .related-section {
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .product-detail-page {
    padding-top: 120px;
  }

  .container {
    padding: 0 16px;
  }

  .gallery-panel,
  .content-panel {
    border-radius: 22px;
  }

  .main-image,
  .image-placeholder {
    min-height: 320px;
  }

  .thumb-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .price-wrap,
  .action-row {
    align-items: stretch;
    flex-direction: column;
  }

  .cart-button {
    width: 100%;
  }
}
</style>
