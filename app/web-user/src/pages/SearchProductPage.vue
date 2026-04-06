<template>
    <div class="search-page">
        <div class="container">
            <section class="hero-banner">
                <p class="eyebrow">产品搜索</p>
                <h1>搜索结果</h1>
                <p class="hero-description">
                    <template v-if="keyword">
                        Found {{ total }} products for "{{ keyword }}".
                    </template>
                    <template v-else>
                        Enter a product name to start searching.
                    </template>
                </p>
            </section>

            <section class="content-card">
                <div v-if="loading" class="state-wrap">
                    <a-spin size="large" />
                </div>
                <a-empty
                    v-else-if="!keyword"
                    description="Please enter a product name"
                />

                <template v-else>
                    <div class="toolbar">
                        <span class="result-count">{{ total }} products</span>
                        <a-button type="link" @click="router.push('/')">Back to home</a-button>
                    </div>

                    <a-empty v-if="!products.length" description="No matching products found" />

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
                                    <span v-if="!product.url">No image</span>
                                </div>
                                <div class="product-info">
                                    <h2>{{ product.name || 'Unnamed product' }}</h2>
                                    <p v-if="product.title" class="product-title">{{ product.title }}</p>
                                    <p v-else-if="product.description" class="product-title">{{ product.description }}</p>
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
                </template>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchProducts } from '@/api/productController';
import { resolveAssetUrl } from '@/utils/asset';
import { normalizeRouteId } from '@/utils/route';

const PAGE_SIZE = 12;

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const keyword = ref('');
const products = ref<API.ProductVO[]>([]);
const total = ref(0);
const current = ref(1);

const formatPrice = (price?: number) => {
    if (typeof price !== 'number') {
        return 'Price TBD';
    }
    return `CNY ${price.toFixed(2)}`;
};

const goToProductDetail = (productId?: string | number | null) => {
    const nextId = normalizeRouteId(productId);
    if (!nextId) {
        return;
    }
    void router.push(`/product/${nextId}`);
};

const loadProducts = async () => {
    const searchKeyword = String(route.query.keyword ?? '').trim();
    const page = Number(route.query.page ?? 1);

    keyword.value = searchKeyword;
    current.value = Number.isInteger(page) && page > 0 ? page : 1;
    products.value = [];
    total.value = 0;

    if (!searchKeyword) {
        loading.value = false;
        return;
    }

    loading.value = true;
    try {
        const response = await searchProducts({
            keyword: searchKeyword,
            current: String(current.value),
            pageSize: String(PAGE_SIZE),
        });
        if (response.code === 0 && response.data) {
            products.value = (response.data.records ?? []).map((product) => ({
                ...product,
                url: resolveAssetUrl(product.url),
            }));
            total.value = Number(response.data.total ?? 0);
        }
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (page: number) => {
    void router.push({
        path: '/search',
        query: {
            keyword: keyword.value,
            page: String(page),
        },
    });
};

watch(
    () => [route.query.keyword, route.query.page],
    () => {
        void loadProducts();
    },
    { immediate: true },
);
</script>

<style scoped>
.search-page {
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

.state-wrap {
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
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
    .search-page {
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
