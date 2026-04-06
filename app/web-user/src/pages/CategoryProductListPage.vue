<template>
    <div class="category-page">
        <div class="container">
            <div v-if="loading" class="state-wrap">
                <a-spin size="large" />
            </div>
            <a-result
                v-else-if="notFound"
                status="404"
                title="分类未找到"
                sub-title="该分类可能已被删除或暂不可用。"
            >
                <template #extra>
                    <a-button type="primary" @click="router.push('/')">返回首页</a-button>
                </template>
            </a-result>
            <template v-else>
                <section class="hero-banner">
                    <p class="eyebrow">分类精选</p>
                    <h1>{{ category?.name || '商品分类' }}</h1>
                    <p class="hero-description">
                        {{ category?.description || '为你呈现这一分类下的精选作品。' }}
                    </p>
                </section>

                <section class="content-card">
                    <div class="toolbar">
                        <span class="result-count">共 {{ total }} 件商品</span>
                        <a-button type="link" @click="router.push('/')">返回首页</a-button>
                    </div>

                    <a-empty v-if="!products.length" description="当前分类下暂无商品" />
                    <template v-else>
                        <div class="product-grid">
                            <article
                                v-for="product in products"
                                :key="product.id"
                                class="product-card"
                                @click="goToProductDetail(product.id)"
                            >
                                <div
                                    class="product-image"
                                    :style="{ backgroundImage: product.url ? `url(${product.url})` : undefined }"
                                >
                                    <span v-if="!product.url">暂无图片</span>
                                </div>
                                <div class="product-info">
                                    <h2>{{ product.name || '未命名商品' }}</h2>
                                    <p v-if="product.title" class="product-title">{{ product.title }}</p>
                                    <p v-else-if="product.description" class="product-title">{{ product.description }}</p>
                                    <div v-if="product.featureLst?.length" class="feature-list">
                                        <span
                                            v-for="(feature, index) in product.featureLst"
                                            :key="`${product.id}-${feature.label}-${index}`"
                                            class="feature-pill"
                                        >
                                            {{ feature.label }}{{ feature.value ? ` · ${feature.value}` : '' }}
                                        </span>
                                    </div>
                                    <div class="card-footer">
                                        <span class="price">{{ formatPrice(product.price) }}</span>
                                        <a-button type="text">查看详情</a-button>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div class="pagination-wrap">
                            <a-pagination
                                :current="current"
                                :page-size="PAGE_SIZE"
                                :total="total"
                                :show-size-changer="false"
                                @change="handlePageChange"
                            />
                        </div>
                    </template>
                </section>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCategoryById, listCategoryProducts } from '@/api/categoryController';
import { resolveAssetUrl } from '@/utils/asset';
import { normalizeRouteId } from '@/utils/route';

const PAGE_SIZE = 12;

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const notFound = ref(false);
const category = ref<API.Category>();
const products = ref<API.ProductVO[]>([]);
const total = ref(0);
const current = ref(1);

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') {
        return '价格待定';
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

const loadCategoryProducts = async () => {
    const categoryId = normalizeRouteId(route.params.categoryId as string | string[] | undefined);
    const page = Number(route.query.page ?? 1);

    if (!categoryId) {
        loading.value = false;
        notFound.value = true;
        return;
    }

    current.value = Number.isInteger(page) && page > 0 ? page : 1;
    loading.value = true;
    notFound.value = false;

    const [categoryResult, productResult] = await Promise.allSettled([
        getCategoryById({ id: categoryId }),
        listCategoryProducts({ categoryId, current: String(current.value), pageSize: String(PAGE_SIZE) }),
    ]);

    if (
        categoryResult.status === 'rejected' ||
        categoryResult.value.code !== 0 ||
        !categoryResult.value.data
    ) {
        category.value = undefined;
        products.value = [];
        total.value = 0;
        notFound.value = true;
        loading.value = false;
        return;
    }

    category.value = categoryResult.value.data;

    if (
        productResult.status === 'fulfilled' &&
        productResult.value.code === 0 &&
        productResult.value.data
    ) {
        products.value = (productResult.value.data.records ?? []).map((product) => ({
            ...product,
            url: resolveAssetUrl(product.url),
        }));
        total.value = Number(productResult.value.data.total ?? 0);
    } else {
        products.value = [];
        total.value = 0;
    }

    loading.value = false;
};

const handlePageChange = (page: number) => {
    void router.push({
        path: `/category/${route.params.categoryId}`,
        query: { page: String(page) },
    });
};

watch(
    () => [route.params.categoryId, route.query.page],
    () => {
        void loadCategoryProducts();
    },
    { immediate: true },
);
</script>

<style scoped>
.category-page {
    min-height: 100vh;
    padding: 140px 0 80px;
    background:
        radial-gradient(circle at top right, rgba(157, 107, 38, 0.18), transparent 24%),
        linear-gradient(180deg, #f7f4ef 0%, #efebe4 100%);
}

.container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
}

.state-wrap {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-banner {
    padding: 24px 8px 40px;
}

.eyebrow {
    margin: 0 0 12px;
    color: #a16e2f;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-size: 0.82rem;
    font-weight: 700;
}

.hero-banner h1 {
    margin: 0;
    font-size: 3.3rem;
    color: #20180f;
}

.hero-description {
    max-width: 720px;
    margin: 18px 0 0;
    color: #5c4f40;
    font-size: 1.08rem;
    line-height: 1.9;
}

.content-card {
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(109, 84, 53, 0.08);
    border-radius: 28px;
    padding: 28px;
    box-shadow: 0 20px 50px rgba(50, 38, 21, 0.08);
    backdrop-filter: blur(16px);
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
}

.result-count {
    color: #6d5b49;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
}

.product-card {
    border-radius: 24px;
    overflow: hidden;
    background: #fbf8f3;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 36px rgba(50, 38, 21, 0.12);
}

.product-image {
    height: 280px;
    background-color: #e6dccd;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c7a63;
}

.product-info {
    padding: 22px;
}

.product-info h2 {
    margin: 0 0 10px;
    font-size: 1.35rem;
    color: #241c13;
}

.product-title {
    min-height: 48px;
    margin: 0 0 16px;
    color: #6c5f51;
    line-height: 1.7;
}

.feature-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 18px;
}

.feature-pill {
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(161, 110, 47, 0.08);
    color: #8c5c1f;
    font-size: 0.85rem;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #9d6b26;
}

.pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}

@media (max-width: 768px) {
    .category-page {
        padding-top: 120px;
    }

    .hero-banner h1 {
        font-size: 2.5rem;
    }

    .content-card {
        padding: 20px;
        border-radius: 22px;
    }

    .toolbar,
    .card-footer {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
