<template>
  <div class="landing-page">
    <!-- 英雄区与无限轮播 -->
    <section class="hero-section">
      <a-carousel autoplay effect="fade" :autoplaySpeed="5000">
        <div v-for="item in heroItems" :key="item.id" class="hero-slide">
          <div class="hero-bg" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <div class="hero-content">
            <div class="glass-panel hero-glass">
              <h1 class="hero-title">{{ item.title }}</h1>
              <p class="hero-subtitle">{{ item.subtitle }}</p>
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
            <div class="visual-placeholder">
              <span>动态艺术</span>
            </div>
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
            <div class="col-image" :style="{ backgroundImage: `url(${col.image})` }"></div>
            <div class="col-overlay">
              <div class="col-text">
                <h3>{{ col.name }}</h3>
                <p>{{ col.desc }}</p>
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
            <div class="product-image" :style="{ backgroundImage: `url(${product.image})` }"></div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="price">{{ product.price }}</p>
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
import { ref } from 'vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';

const heroItems = ref([
  {
    id: 1,
    title: "永恒的雅致",
    subtitle: "领略钟表艺术的巅峰之作。",
    image: "https://images.unsplash.com/photo-1547996663-b855816e2b61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 2,
    title: "现代传承",
    subtitle: "传统与当代设计的完美融合。",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  },
  {
    id: 3,
    title: "精准定义",
    subtitle: "为珍惜每一秒的您而设计。",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
  }
]);

const collections = ref([
  {
    id: 1,
    name: "大巡航系列",
    desc: "专为探索无尽深蓝而生。",
    image: "https://images.unsplash.com/photo-1517466100529-67d7162985f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "恒动美学",
    desc: "极简主义与极致工艺的平衡。",
    image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
]);

const products = ref([
  {
    id: 1,
    name: "皇家橡树离岸型",
    price: "¥205,000",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "鹦鹉螺 Ref. 5711",
    price: "¥250,000",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "超霸系列登月表",
    price: "¥54,500",
    image: "https://images.unsplash.com/photo-1623998021450-85c29c644e0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
]);
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
}

.visual-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f3f3f3, #e9e9e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 2rem;
  color: #ccc;
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