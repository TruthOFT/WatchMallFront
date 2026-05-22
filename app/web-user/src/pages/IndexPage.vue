<template>
  <div class="landing-page">
    <section class="hero-section">
      <a-carousel autoplay effect="fade" :autoplaySpeed="5000">
        <div
          v-for="item in heroItems"
          :key="item.id"
          class="hero-slide clickable"
          @click="goToProductDetail(item.id)"
        >
          <div
            class="hero-bg"
            :style="{ backgroundImage: `url(${item.url})` }"
          ></div>
          <div class="hero-content">
            <div class="glass-panel hero-glass">
              <h1 class="hero-title">{{ item.title }}</h1>
              <p class="hero-subtitle">{{ item.description }}</p>
              <a-button
                type="primary"
                size="large"
                class="hero-cta"
                @click.stop="goToProductDetail(item.id)"
              >
                探索系列
              </a-button>
            </div>
          </div>
        </div>
      </a-carousel>
    </section>

    <section class="shop-floor-section">
      <div class="container">
        <div class="shop-floor-header">
          <div>
            <span class="eyebrow">SHOP BY CATEGORY</span>
            <h2>浏览分类与全部商品</h2>
          </div>
          <p>把分类入口和商品列表放在首页第一屏之后，进入页面就能直接选类、看货、进详情。</p>
        </div>

        <div v-if="categoriesLoading" class="category-state">
          <a-spin />
        </div>

        <a-empty
          v-else-if="!collections.length"
          class="category-state"
          description="暂无分类"
        />

        <template v-else>
          <div class="category-rail">
            <div
              v-for="col in collections"
              :key="col.id"
              class="category-tile"
              @click="goToCategoryPage(col.id)"
            >
              <div
                class="category-thumb"
                :style="{ backgroundImage: col.icon ? `url(${col.icon})` : undefined }"
              >
                <span v-if="!col.icon">{{ col.name?.slice(0, 1) || '类' }}</span>
              </div>
              <strong>{{ col.name }}</strong>
              <p>{{ col.description || '查看该分类下的商品' }}</p>
            </div>
          </div>

          <div v-if="categoryTotal > CATEGORY_PAGE_SIZE" class="pagination-wrap category-pagination">
            <a-pagination
              :current="categoryCurrent"
              :page-size="CATEGORY_PAGE_SIZE"
              :total="categoryTotal"
              :show-size-changer="false"
              @change="handleCategoryPageChange"
            />
          </div>
        </template>

        <div class="product-showcase-heading">
          <div>
            <span class="eyebrow">ALL PRODUCTS</span>
            <h2>全部商品</h2>
          </div>
          <span class="product-count">{{ productTotal }} 件商品</span>
        </div>

        <div v-if="productsLoading" class="product-state">
          <a-spin size="large" />
        </div>

        <a-empty
          v-else-if="!products.length"
          class="product-state"
          description="当前暂无商品"
        />

        <template v-else>
          <div class="product-grid">
            <div
              v-for="product in products"
              :key="product.id"
              class="product-card"
              @click="goToProductDetail(product.id)"
            >
              <div
                class="product-image"
                :style="{ backgroundImage: product.url ? `url(${product.url})` : undefined }"
              ></div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p v-if="product.title || product.description" class="product-title">
                  {{ product.title || product.description }}
                </p>
                <p class="price">{{ formatPrice(product.price) }}</p>
                <a-button
                  type="text"
                  class="shop-btn"
                  @click.stop="goToProductDetail(product.id)"
                >
                  查看详情
                </a-button>
              </div>
            </div>
          </div>

          <div v-if="productTotal > PRODUCT_PAGE_SIZE" class="pagination-wrap">
            <a-pagination
              :current="productCurrent"
              :page-size="PRODUCT_PAGE_SIZE"
              :total="productTotal"
              :show-size-changer="false"
              @change="handleProductPageChange"
            />
          </div>
        </template>
      </div>
    </section>

    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <span class="eyebrow">卓越工艺精神</span>
            <h2>精准与优雅的邂逅</h2>
            <p>
              我们系列中的每一枚时计都讲述着传承、创新与不妥协品质的故事。我们只精选最顶级的腕表，
              使其超越简单的计时工具，成为未来的传世之宝。
            </p>
            <a
              class="text-link clickable-link"
              @click.prevent="goToProductDetail(featuredProduct?.id)"
            >
              阅读我们的故事
            </a>
          </div>
          <div
            class="story-visual liquid-glass clickable"
            @click="goToProductDetail(featuredProduct?.id)"
          >
            <div
              class="story-image"
              :style="{ backgroundImage: `url(${storyImage})` }"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { home, pageProducts } from "@/api/productController";
import { pageCategory } from "@/api/categoryController";
import { resolveAssetUrl } from "@/utils/asset";
import { normalizeRouteId } from "@/utils/route";

const router = useRouter();
const CATEGORY_PAGE_SIZE = 10;
const PRODUCT_PAGE_SIZE = 10;

const heroItems = ref<API.ProductVO[]>([]);
const featuredProduct = ref<API.ProductVO>();
const storyImage = ref("");
const products = ref<API.ProductVO[]>([]);
const collections = ref<API.CategoryVO[]>([]);
const productsLoading = ref(true);
const categoriesLoading = ref(true);
const categoryCurrent = ref(1);
const categoryTotal = ref(0);
const productCurrent = ref(1);
const productTotal = ref(0);

const normalizeProducts = (items?: API.ProductVO[]) =>
  (items ?? []).map((item) => ({
    ...item,
    url: resolveAssetUrl(item.url),
  }));

const normalizeCategories = (items?: Array<API.Category | API.CategoryVO>) =>
  (items ?? []).map((item) => ({
    ...item,
    icon: resolveAssetUrl(item.icon),
  }));

const formatPrice = (price?: number) => {
  if (typeof price !== "number") {
    return "价格待定";
  }
  return `¥${price.toFixed(2)}`;
};

const goToProductDetail = (productId?: string | number | null) => {
  const nextId = normalizeRouteId(productId);
  if (!nextId) {
    return;
  }
  void router.push(`/product/${nextId}`);
};

const goToCategoryPage = (categoryId?: string | number | null) => {
  const nextId = normalizeRouteId(categoryId);
  if (!nextId) {
    return;
  }
  void router.push({
    path: `/category/${nextId}`,
    query: { page: "1" },
  });
};

const loadCategoryPage = async (
  page = categoryCurrent.value,
  fallbackList: Array<API.Category | API.CategoryVO> = []
) => {
  categoriesLoading.value = true;
  try {
    const response = await pageCategory({
      current: String(page),
      pageSize: String(CATEGORY_PAGE_SIZE),
    });
    if (response.code === 0 && response.data) {
      collections.value = normalizeCategories(response.data.records);
      categoryCurrent.value = Number(response.data.current ?? page);
      categoryTotal.value = Number(response.data.total ?? 0);
      return;
    }
    collections.value = normalizeCategories(fallbackList);
    categoryCurrent.value = 1;
    categoryTotal.value = fallbackList.length;
  } catch (error) {
    console.log(error);
    collections.value = normalizeCategories(fallbackList);
    categoryCurrent.value = 1;
    categoryTotal.value = fallbackList.length;
  } finally {
    categoriesLoading.value = false;
  }
};

const loadProductPage = async (
  page = productCurrent.value,
  fallbackList: API.ProductVO[] = []
) => {
  productsLoading.value = true;
  try {
    const response = await pageProducts({
      current: String(page),
      pageSize: String(PRODUCT_PAGE_SIZE),
    });
    if (response.code === 0 && response.data) {
      products.value = normalizeProducts(response.data.records);
      productCurrent.value = Number(response.data.current ?? page);
      productTotal.value = Number(response.data.total ?? 0);
      return;
    }
    products.value = normalizeProducts(fallbackList);
    productCurrent.value = 1;
    productTotal.value = fallbackList.length;
  } catch (error) {
    console.log(error);
    products.value = normalizeProducts(fallbackList);
    productCurrent.value = 1;
    productTotal.value = fallbackList.length;
  } finally {
    productsLoading.value = false;
  }
};

const fetchData = async () => {
  let fallbackCategories: API.CategoryVO[] = [];
  let fallbackProducts: API.ProductVO[] = [];
  try {
    const res = await home();
    if (res.code !== 0 || !res.data) {
      return;
    }

    heroItems.value = (res.data.bannerList ?? []).map((item) => ({
      ...item,
      url: resolveAssetUrl(item.url),
    }));

    featuredProduct.value = res.data.productVO
      ? {
          ...res.data.productVO,
          url: resolveAssetUrl(res.data.productVO.url),
        }
      : undefined;
    storyImage.value = featuredProduct.value?.url ?? "";

    fallbackCategories = res.data.categoryVOList ?? [];
    fallbackProducts = res.data.recommendList ?? [];
  } catch (error) {
    console.log(error);
  } finally {
    await Promise.all([
      loadCategoryPage(1, fallbackCategories),
      loadProductPage(1, fallbackProducts),
    ]);
  }
};

const handleCategoryPageChange = (page: number) => {
  void loadCategoryPage(page);
};

const handleProductPageChange = (page: number) => {
  void loadProductPage(page);
};

onMounted(() => {
  void fetchData();
});
</script>

<style scoped>
.landing-page {
  width: 100%;
}

.clickable {
  cursor: pointer;
}

.clickable-link {
  cursor: pointer;
}

.hero-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-slide {
  height: 100vh;
  position: relative;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  transition: transform 10s ease;
}

.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.hero-glass {
  padding: 60px 80px;
  text-align: center;
  max-width: 800px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
}

.hero-title {
  font-size: 4rem;
  font-weight: 300;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: -1px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  font-weight: 300;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-cta);
  margin-bottom: 16px;
  font-weight: 600;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 3rem;
  margin-bottom: 16px;
}

.section-header p {
  color: var(--color-secondary);
  font-style: italic;
  font-size: 1.2rem;
  font-family: var(--font-heading);
}

.text-link {
  display: inline-block;
  margin-top: 24px;
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-cta);
  padding-bottom: 4px;
  transition: all 0.3s;
}

.text-link:hover {
  color: var(--color-cta);
}

.shop-floor-section {
  padding: 88px 0 110px;
  background-color: var(--color-bg-main);
}

.shop-floor-header,
.product-showcase-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 32px;
}

.shop-floor-header h2,
.product-showcase-heading h2 {
  font-size: 3rem;
  margin: 0;
}

.shop-floor-header p {
  max-width: 440px;
  color: var(--color-secondary);
  line-height: 1.8;
  margin: 0;
}

.category-rail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.category-state {
  min-height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 72px;
}

.category-rail + .product-showcase-heading {
  margin-top: 48px;
}

.category-tile {
  min-height: 178px;
  padding: 18px;
  border: 1px solid rgba(109, 84, 53, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 16px 36px rgba(50, 38, 21, 0.07);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.category-tile:hover {
  transform: translateY(-5px);
  border-color: rgba(161, 110, 47, 0.36);
  box-shadow: 0 20px 42px rgba(50, 38, 21, 0.12);
}

.category-thumb {
  height: 80px;
  border-radius: 14px;
  background-color: #e6dccd;
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c5c1f;
  font-size: 2rem;
  font-family: var(--font-heading);
}

.category-tile strong {
  color: var(--color-primary);
  font-size: 1.08rem;
  margin-bottom: 8px;
}

.category-tile p {
  color: var(--color-secondary);
  display: -webkit-box;
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-count {
  color: var(--color-cta);
  font-family: var(--font-body);
  font-weight: 700;
  padding-bottom: 8px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 26px;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.category-pagination {
  margin-bottom: 72px;
}

.product-state {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(109, 84, 53, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 40px rgba(50, 38, 21, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px rgba(50, 38, 21, 0.14);
}

.product-image {
  height: 260px;
  flex: none;
  background-color: #e6dccd;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
  background: rgba(255, 255, 255, 0.74);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.product-info h3 {
  color: var(--color-primary);
  font-size: 1.24rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.product-title {
  color: var(--color-secondary);
  display: -webkit-box;
  font-size: 0.94rem;
  line-height: 1.6;
  min-height: 48px;
  margin: 0 0 14px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price {
  color: var(--color-cta);
  font-family: var(--font-body);
  font-weight: 600;
  margin-bottom: 16px;
}

.shop-btn {
  color: var(--color-secondary);
  padding: 0;
}

.story-section {
  padding: 110px 0;
  background-color: #fff;
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.story-content h2 {
  font-size: 3rem;
  margin-bottom: 24px;
}

.story-content p {
  color: var(--color-secondary);
  line-height: 1.8;
  font-size: 1.1rem;
}

.story-visual {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.story-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.story-visual:hover .story-image {
  transform: scale(1.1);
}

.membership-section {
  padding: 120px 0;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.membership-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://images.unsplash.com/photo-1492106087820-71f17178f48b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")
    center/cover;
  opacity: 0.4;
}

.membership-container {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.membership-card {
  padding: 80px;
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.text-light {
  color: #fff;
}

.text-light-muted {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 40px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.membership-form {
  display: flex;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto 32px;
}

.waitlist-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.count {
  font-weight: 700;
}

@media (max-width: 768px) {
  .shop-floor-header,
  .product-showcase-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .shop-floor-header h2,
  .product-showcase-heading h2,
  .story-content h2 {
    font-size: 2.3rem;
  }

  .category-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .story-grid {
    grid-template-columns: 1fr;
  }

  .membership-form {
    flex-direction: column;
  }
}
</style>
