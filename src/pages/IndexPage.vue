<script setup lang="ts">
import {onMounted, ref, computed, h} from 'vue';
// TODO: 接口联调时可引入真实 API
import {home} from '@/api/productController';
import {BASE_URL} from '@/request'
import {
  SafetyCertificateOutlined,
  GlobalOutlined,
  RocketOutlined,
  ToolOutlined
} from '@ant-design/icons-vue';

type ServiceItem = { id: number; title: string; desc: string; icon: any };

const loading = ref(true);
const categories = ref<API.CategoryVO[]>([]);
const banners = ref<API.ProductVO[]>([]);
const hero = ref<API.ProductVO>({});
const products = ref<API.ProductVO[]>([]);
const hotProducts = ref<API.ProductVO[]>([]);
const services = ref<ServiceItem[]>([]);

const fetchHomeData = async () => {
  loading.value = false;

  const res = await home();
  if (res.code === 0) {
    console.log(res.data);
    let categoryVOLst = res.data.categoryVOList;
    categoryVOLst = categoryVOLst.map((item: API.CategoryVO) => ({
      ...item,
      categoryImgUrl: BASE_URL + item.categoryImgUrl
    }))
    categories.value = categoryVOLst;
    hero.value = res.data.productVO;
    hero.value.imageUrl = BASE_URL + res.data.productVO.imageUrl;
    let bannerList = res.data.bannerList;
    bannerList.map((item: API.ProductVO) => ({
      ...item,
      imageUrl: BASE_URL + item.imageUrl
    }))
    banners.value = bannerList;
    let recommendLst = res.data.recommendList;
    recommendLst = recommendLst.map((item: API.ProductVO) => ({
      ...item,
      imageUrl: BASE_URL + item.imageUrl
    }))
    products.value = recommendLst;
    let choiceLst = res.data.choiceList;
    choiceLst = choiceLst.map((item: API.ProductVO) => ({
      ...item,
      imageUrl: BASE_URL + item.imageUrl
    }))
    hotProducts.value = choiceLst;
    console.log(choiceLst)
  }
  

  services.value = [
    {id: 1, title: '官方正品保证', desc: '100% 品牌授权认证', icon: SafetyCertificateOutlined},
    {id: 2, title: '全球联保服务', desc: '5年超长质保承诺', icon: GlobalOutlined},
    {id: 3, title: '尊享无忧配送', desc: '顺丰加密安全送达', icon: RocketOutlined},
    {id: 4, title: '终身免费保养', desc: '专业技师定期维护', icon: ToolOutlined}
  ];


  loading.value = false;
};

onMounted(fetchHomeData);


const bannerAccent = (tag?: string, id?: number) => {
  const palette = ['#c59a42', '#b77e2f', '#1f3b32', '#d4b06a', '#8d6b2d'];
  if (!tag && id == null) return palette[0];
  const seed = `${tag ?? ''}${id ?? ''}`.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[seed % palette.length];
};

const getImgUrl = (url: string) => {
  console.log(url)
  return url ? `${BASE_URL}${url}` : '/bg.png'
};

const bannerStyle = (b: API.ProductVO) => ({
  '--accent': bannerAccent(b.tag, b.id),
  backgroundImage: `linear-gradient(115deg, rgba(28, 23, 17, 0.72), rgba(28, 23, 17, 0.18)), url(${b.imageUrl})`
});
const featureList = computed(() => hero.value?.feature ?? []);
</script>

<template>
  <a-spin :spinning="loading">
    <div class="index-page">
      <a-space direction="vertical" size="large" style="width: 100%">
        <a-card :bordered="false">
          <a-row :gutter="[24, 24]" align="middle">
            <a-col :xs="24" :md="12">
              <a-typography-title :level="2">{{ hero.title }}</a-typography-title>
              <a-typography-paragraph>
                {{ hero.description }}
              </a-typography-paragraph>
              <a-space>
                <a-button type="primary">立即选购</a-button>
              </a-space>
              <a-divider/>
              <a-row :gutter="[16, 16]">
                <a-col v-for="h in featureList" :key="h.label" :xs="12" :md="6">
                  <a-statistic :title="h.label" :value="h.value"/>
                </a-col>
              </a-row>
            </a-col>
            <a-col :xs="24" :md="12">
              <img :src="hero.imageUrl" alt="hero" style="width: 100%; border-radius: 16px"/>
            </a-col>
          </a-row>
        </a-card>

        <a-carousel autoplay>
          <div v-for="b in banners" :key="b.id">
            <div class="banner-shell" :style="bannerStyle(b)">
              <div class="banner-grid">
                <div class="banner-copy">
                  <div class="banner-eyebrow">
                    <a-tag class="product-tag" :bordered="false">{{ b.tag ?? '无' }}</a-tag>
                    <span class="banner-name">{{ b.productName }}</span>
                  </div>
                  <a-typography-title :level="2" class="banner-title">{{ b.title }}</a-typography-title>
                  <a-typography-paragraph class="banner-sub">
                    {{ b.description }}
                  </a-typography-paragraph>
                  <div class="banner-features">
                    <div v-for="f in (b.feature ?? [])" :key="f.label" class="feature-pill">
                      <span class="feature-label">{{ f.label }}</span>
                      <span class="feature-value">{{ f.value }}</span>
                    </div>
                  </div>
                  <div class="banner-actions">
                    <a-button type="primary">立即选购</a-button>
                  </div>
                </div>
                <div class="banner-visual">
                  <div class="banner-image-wrap">
                    <img :src="getImgUrl(b.imageUrl)" alt="banner"/>
                  </div>
                  <div class="banner-spec-card">
                    <div class="spec-title">产品亮点</div>
                    <div class="spec-list">
                      <div v-for="f in (b.feature ?? []).slice(0, 3)" :key="f.label" class="spec-item">
                        <span>{{ f.label }}</span>
                        <strong>{{ f.value }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-carousel>

        <a-card :bordered="false" class="section-card">
          <div class="section-header">
             <a-typography-title :level="3" class="section-title">系列精选</a-typography-title>
          </div>
          <a-row :gutter="[24, 24]">
            <a-col v-for="c in categories" :key="c.id" :xs="12" :md="6">
              <a-card hoverable class="product-card" :bordered="false">
                <template #cover>
                  <div class="product-img-wrap">
                    <img :src="c.categoryImgUrl" :alt="c.categoryName" />
                    <div class="product-hover-overlay">
                      <a-button type="primary" shape="round">了解详情</a-button>
                    </div>
                  </div>
                </template>
                <div class="product-info">
                  <div class="product-title" :title="c.categoryName">{{ c.categoryName }}</div>
                  <div class="product-sub-title">{{ c.description }}</div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>

        <a-card :bordered="false" class="section-card">
          <div class="section-header">
            <a-typography-title :level="3" class="section-title">当季推荐</a-typography-title>
             <a-button type="link">探索更多 ></a-button>
          </div>
          <a-row :gutter="[24, 24]">
            <a-col v-for="p in products" :key="p.id" :xs="12" :md="6">
              <a-card hoverable class="product-card" :bordered="false">
                <template #cover>
                   <div class="product-img-wrap">
                    <img :src="p.imageUrl" :alt="p.productName" />
                    <div class="product-hover-overlay">
                      <a-button type="primary" shape="round">查看详情</a-button>
                    </div>
                   </div>
                </template>
                 <div class="product-info">
                   <div class="product-tag-row">
                      <a-tag class="product-tag" v-if="p.tag" :bordered="false">{{ p.tag }}</a-tag>
                   </div>
                   <div class="product-title" :title="p.productName">{{ p.productName }}</div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>


        <a-card :bordered="false" class="hot-sales-section">
          <div class="section-header">
            <a-typography-title :level="3" style="margin: 0;">热销榜单</a-typography-title>
            <a-button type="link">查看全部 ></a-button>
          </div>
          <a-row :gutter="[24, 24]">
            <a-col v-for="p in hotProducts" :key="p.id" :xs="12" :sm="12" :md="6">
              <a-card hoverable class="product-card" :bordered="false">
                <template #cover>
                  <div class="product-img-wrap">
                    <img :src="p.imageUrl" :alt="p.productName" />
                    <!-- 简单的悬浮遮罩或按钮 -->
                    <div class="product-hover-overlay">
                      <a-button type="primary" shape="round">立即购买</a-button>
                    </div>
                  </div>
                </template>
                <div class="product-info">
                  <div class="product-tag-row">
                     <a-tag class="product-tag" v-if="p.tag" :bordered="false">{{ p.tag }}</a-tag>
                  </div>
                  <div class="product-title" :title="p.productName">{{ p.productName }}</div>
                  <div class="product-sub-title">{{ p.title }}</div>
                  <div class="product-price">
                    <span class="currency">¥</span>
                    <span class="value">{{ p.price ?? '无价' }}</span>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>

        <div class="brand-service-section">
          <a-row :gutter="[32, 32]" justify="center">
            <a-col :xs="24" :sm="12" :md="6" v-for="item in services" :key="item.id">
              <div class="service-item">
                <div class="service-icon">
                  <component :is="item.icon" style="font-size: 32px; color: #1a1a1a;" />
                </div>
                <div class="service-content">
                  <div class="service-title">{{ item.title }}</div>
                  <div class="service-desc">{{ item.desc }}</div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-space>
    </div>
  </a-spin>
</template>

<style scoped>
.index-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  /* 更细腻的高级感背景 */
  background:
    radial-gradient(800px 400px at 10% -10%, rgba(24, 144, 255, 0.12), transparent 70%),
    radial-gradient(600px 600px at 90% 20%, rgba(135, 208, 104, 0.08), transparent 60%),
    radial-gradient(900px 400px at 50% 100%, rgba(24, 144, 255, 0.05), transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #f0f5ff 100%);
  --brand-primary: #1890ff;
  --brand-glow: rgba(24, 144, 255, 0.35);
  --shadow-soft: 0 10px 40px -10px rgba(24, 39, 75, 0.08);
  --shadow-hover: 0 20px 48px -12px rgba(24, 39, 75, 0.18);
  --card-radius: 16px;
}

:deep(.ant-space) {
  width: 100%;
}

.section-card {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.section-title {
  margin: 0 !important;
  position: relative;
  padding-left: 16px;
  letter-spacing: 0.5px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 24px;
  transform: translateY(-50%);
  border-radius: 4px;
  background: linear-gradient(180deg, var(--brand-primary), #69c0ff);
  box-shadow: 0 2px 8px var(--brand-glow);
}

img[alt='hero'] {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(15, 37, 75, 0.2);
  /* 组合动画：仅保留入场 */
  animation: heroReveal 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.banner-shell {
  padding: 48px;
  border-radius: 20px;
  /* 更深邃的渐变质感 */
  background: linear-gradient(120deg, #001529 0%, #003a8c 100%);
  color: #fff;
  min-height: 440px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(0, 58, 140, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.2), transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.15), transparent 50%);
  opacity: 0.6;
  pointer-events: none;
  filter: blur(40px);
}

.banner-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  align-items: center;
  width: 100%;
  z-index: 1;
}

.banner-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.banner-tag {
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--brand-primary);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-right: 0; /* Reset ant-tag margin */
  border: none;
}

.banner-name {
  opacity: 0.85;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.banner-title {
  margin: 0 0 16px;
  font-size: 36px;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.banner-sub {
  margin: 0 0 28px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.6;
  max-width: 90%;
}

.banner-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.feature-pill {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  transition: background 0.3s;
}

.feature-pill:hover {
  background: rgba(255, 255, 255, 0.15);
}

.feature-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
}

.feature-value {
  display: block;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.banner-image-wrap {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 4 / 5;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.4);
  transform: translateZ(0);
  border: 4px solid rgba(255, 255, 255, 0.1);
}

.banner-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.banner-spec-card {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.spec-title {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 8px;
}

.spec-list {
  display: grid;
  gap: 10px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.spec-item strong {
  color: #fff;
  font-weight: 600;
}

.product-card,
.category-card {
  border-radius: var(--card-radius);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.product-card:hover,
.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: transparent;
}

.product-img-wrap {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f8f9fa;
  overflow: hidden;
}

.product-img-wrap img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  mix-blend-mode: multiply; /* 增强图片融合感 */
}

.product-hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .product-hover-overlay {
  opacity: 1;
}

.product-card:hover .product-img-wrap img {
  transform: scale(1.08);
}

.product-info {
  padding: 20px;
}

.product-tag-row {
  min-height: 24px;
  margin-bottom: 8px;
}

.product-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  background: linear-gradient(135deg, var(--brand-primary), #36cfc9);
  color: #fff;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
  margin-right: 0;
  border: none;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-sub-title {
  color: #8c8c8c;
  font-size: 13px;
  margin-bottom: 12px;
}

.product-price {
  color: #ff4d4f;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.product-price .currency {
  font-size: 13px;
}

.category-img-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.category-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.category-card:hover .category-img-wrap img {
  transform: scale(1.08);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}

.category-card:hover .category-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.35);
}

.category-btn {
  /* 仅保留动画属性，样式由 type="primary" 接管 */
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.category-card:hover .category-btn {
  transform: translateY(0);
  opacity: 1;
}

.category-info {
  padding: 20px;
  text-align: center;
}

.category-name {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 6px;
}

.category-desc,
.service-desc {
  color: #8c8c8c;
  font-size: 13px;
}

.brand-service-section {
  margin-top: 60px;
  padding: 60px 24px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0,0,0,0.02);
}

.service-item {
  text-align: center;
  padding: 32px 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: transparent;
}

.service-item:hover {
  background: #f8fafc;
  transform: translateY(-5px);
}

.service-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.15);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.service-item:hover .service-icon {
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 12px 28px rgba(24, 144, 255, 0.25);
}

.service-icon :deep(svg) {
  color: var(--brand-primary) !important;
  font-size: 32px !important;
  filter: drop-shadow(0 2px 4px rgba(24, 144, 255, 0.2));
}

.service-title {
  color: #1f1f1f;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.service-content {
  text-align: center;
}

.hot-sales-section {
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
}

.banner-shell:hover .banner-image-wrap img {
  transform: scale(1.05);
}

:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
  transition: all 0.3s;
}

:deep(.ant-btn-primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.45);
  filter: brightness(1.1);
}

:deep(.ant-space-item) {
  opacity: 0;
  animation: sectionRise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

:deep(.ant-space-item:nth-child(1)) { animation-delay: 0.1s; }
:deep(.ant-space-item:nth-child(2)) { animation-delay: 0.2s; }
:deep(.ant-space-item:nth-child(3)) { animation-delay: 0.3s; }
:deep(.ant-space-item:nth-child(4)) { animation-delay: 0.4s; }
:deep(.ant-space-item:nth-child(5)) { animation-delay: 0.5s; }
:deep(.ant-space-item:nth-child(6)) { animation-delay: 0.6s; }

:deep(.ant-carousel .slick-active .banner-shell) {
  animation: bannerEnter 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

@keyframes sectionRise {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@keyframes bannerEnter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

@media (max-width: 900px) {
  .banner-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .banner-shell {
    padding: 32px;
    min-height: auto;
  }

  .banner-image-wrap {
    max-width: 240px;
  }
}

@media (max-width: 640px) {
  .index-page {
    padding: 16px;
  }
  
  .banner-title {
    font-size: 28px;
  }

  .banner-features {
    grid-template-columns: 1fr 1fr;
  }
  
  .banner-shell {
    padding: 24px;
  }
  
  .brand-service-section {
    padding: 32px 16px;
  }
}
</style>
