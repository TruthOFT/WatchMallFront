<template>
  <div class="landing-page">
    <!-- 英雄区与无限轮播 -->
    <section class="hero-section">
      <a-carousel autoplay effect="fade" :autoplaySpeed="5000">
        <div v-for="item in heroItems" :key="item.id" class="hero-slide">
          <div class="hero-bg" :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
          <div class="hero-content">
            <div class="glass-panel hero-glass">
              <h1 class="hero-title">{{ item.title }}</h1>
              <p class="hero-subtitle">{{ item.description }}</p>
              <a-button type="primary" size="large" class="hero-cta">探索系列</a-button>
            </div>
          </div>
        </div>
      </a-carousel>
    </section>

    <!-- 品牌价值 / 叙事区 -->
    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <span class="eyebrow">卓越工匠精神</span>
            <h2>精准与优雅的邂逅</h2>
            <p>我们系列中的每一枚时计都讲述着传承、创新与不妥协品质的故事。我们只精选最顶级的腕表，使其超越简单的计时工具，成为未来的传世之宝。</p>
            <a href="#" class="text-link">阅读我们的故事</a>
          </div>
          <div class="story-visual liquid-glass">
            <div class="story-image" :style="{ backgroundImage: `url(${storyImage})` }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 系列推荐 (新加部分) -->
    <section class="collections-gallery">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">甄选系列</span>
          <h2>定义您的风格</h2>
        </div>
        <div class="collections-grid">
          <div v-for="col in collections" :key="col.id" class="collection-card liquid-glass">
            <div class="col-image" :style="{ backgroundImage: `url(${col.categoryImgUrl})` }"></div>
            <div class="col-overlay">
              <div class="col-text">
                <h3>{{ col.categoryName }}</h3>
                <p>{{ col.description }}</p>
                <a-button type="link" class="explore-btn">立即探索 <arrow-right-outlined /></a-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 精选产品展示 -->
    <section class="showcase-section">
      <div class="container">
        <div class="section-header">
          <h2>甄选精品</h2>
          <p>为少数鉴赏家悉心挑选。</p>
        </div>
        
        <div class="product-grid">
          <div v-for="product in products" :key="product.id" class="product-card liquid-glass">
            <div class="product-image" :style="{ backgroundImage: `url(${product.imageUrl})` }"></div>
            <div class="product-info">
              <h3>{{ product.productName }}</h3>
              <p class="price">{{ product.price ?? '无价' }}</p>
              <a-button type="text" class="shop-btn">查看详情</a-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 独家会员 CTA -->
    <section class="membership-section">
      <div class="membership-bg"></div>
      <div class="container membership-container">
        <div class="membership-card liquid-glass-dark">
          <div class="membership-content">
            <span class="eyebrow text-gradient-gold">尊享俱乐部</span>
            <h2 class="text-light">开启非凡体验</h2>
            <p class="text-light-muted">加入我们的独家会员俱乐部，优先获取限量版资讯、参加私人鉴赏会并享受定制礼宾服务。</p>
            <div class="membership-form">
              <a-input placeholder="您的电子邮箱地址" size="large" />
              <a-button type="primary" size="large">申请加入</a-button>
            </div>
            <p class="waitlist-count">
              已有 <span class="count text-gradient-gold">2,481</span> 位鉴赏家在候补名单中
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { home } from '@/api/productController';
import { BASE_URL } from '@/request';
const heroItems = ref<API.ProductVO[]>([]);
const storyImage = ref("");
const products = ref<API.ProductVO[]>([]);
const collections = ref<API.CategoryVO[]>([]);
const fetchData = async () => {

  try {
    const res = await home();
    if (res.code === 0) {
      let tmpBannerLst = res.data.bannerList;
      tmpBannerLst = tmpBannerLst.map(item => ({
        ...item,
        imageUrl: BASE_URL + item.imageUrl
      }))
      heroItems.value = tmpBannerLst;
      storyImage.value = BASE_URL + res.data.productVO.imageUrl;
      let tmpProducts = res.data.recommendList;
      tmpProducts = tmpProducts.map(item => ({
        ...item,
        imageUrl: BASE_URL + item.imageUrl
      }))
      products.value = tmpProducts;
      let tmpCollection = res.data.categoryVOList;
      tmpCollection = tmpCollection.map(item => ({
        ...item,
        categoryImgUrl: BASE_URL + item.categoryImgUrl
      }))
      collections.value = tmpCollection;
    }
  } catch (error) {
    console.log(error);
  }

}

onMounted( async () => await fetchData() )
</script>

<style scoped>
.landing-page {
  width: 100%;
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
  background: rgba(0,0,0,0.3);
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
  color: rgba(255,255,255,0.9);
  margin-bottom: 40px;
  font-weight: 300;
}

/* Sections Common */
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

/* Story Section */
.story-section {
  padding: 120px 0;
  background-color: var(--color-bg-main);
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

/* Collections Gallery (New) */
.collections-gallery {
  padding: 100px 0;
  background-color: #fff;
}

.collections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.collection-card {
  position: relative;
  height: 450px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 24px;
}

.col-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover .col-image {
  transform: scale(1.1);
}

.col-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
  display: flex;
  align-items: flex-end;
  padding: 48px;
}

.col-text h3 {
  color: #fff;
  font-size: 2.2rem;
  margin-bottom: 12px;
}

.col-text p {
  color: rgba(255,255,255,0.8);
  font-size: 1.1rem;
  margin-bottom: 24px;
  max-width: 300px;
}

.explore-btn {
  color: var(--color-cta) !important;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* Product Showcase */
.showcase-section {
  padding: 120px 0;
  background-color: var(--color-bg-main);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.product-card {
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
}

.product-image {
  flex: 1;
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 24px;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0,0,0,0.05);
  text-align: center;
}

.product-info h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.price {
  color: var(--color-cta);
  font-family: var(--font-body);
  font-weight: 600;
  margin-bottom: 16px;
}

.shop-btn {
  color: var(--color-secondary);
}

/* Membership Section */
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
  background: url('https://images.unsplash.com/photo-1492106087820-71f17178f48b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover;
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
  color: rgba(255,255,255,0.7);
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
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
}

.count {
  font-weight: 700;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .story-grid, .collections-grid {
    grid-template-columns: 1fr;
  }
  
  .membership-form {
    flex-direction: column;
  }
}
</style>