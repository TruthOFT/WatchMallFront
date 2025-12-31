<script setup lang="ts">
import {
  TrophyOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  RocketOutlined
} from '@ant-design/icons-vue';

// 适配 Vite 的静态资源路径处理
const getImageUrl = (url: string) => {
  return new URL(url, import.meta.url).href;
};

// 核心价值数据
const features = [
  {
    icon: TrophyOutlined,
    title: "大师工艺",
    desc: "每一块腕表都由拥有20年经验的工匠手工装配，追求极致细节。"
  },
  {
    icon: SafetyCertificateOutlined,
    title: "正品保障",
    desc: "官方授权认证，每一块手表均配有独立编码与全球联保卡。"
  },
  {
    icon: RocketOutlined,
    title: "极速配送",
    desc: "顺丰冷链直发，24小时内发货，确保您第一时间收到心仪之物。"
  },
  {
    icon: CustomerServiceOutlined,
    title: "尊享服务",
    desc: "提供终身免费清洗保养服务，以及1对1专属客服咨询。"
  }
];

// 发展历程数据
const history = [
  { year: '2020', title: '品牌创立', desc: '在瑞士日内瓦成立设计工作室' },
  { year: '2021', title: '首款发布', desc: '推出“星际系列”机械表，获得设计大奖' },
  { year: '2022', title: '全球扩张', desc: '开设首家线下旗舰店，进军亚洲市场' },
  { year: '2023', title: '百万用户', desc: '全球累计服务用户突破100万人' },
];
</script>

<template>
  <div class="about-page">

    <div class="hero-section">
      <div class="hero-overlay">
        <h1 class="hero-title">时光流转 · 经典永恒</h1>
        <p class="hero-subtitle">致力于为全球绅士打造独一无二的腕间艺术</p>
      </div>
    </div>

    <div class="content-wrapper">

      <section class="section">
        <a-row :gutter="[48, 24]" align="middle">
          <a-col :xs="24" :md="12">
            <img
                :src="getImageUrl('../assets/watches/w1.jpg')"
                class="story-img"
                alt="Brand Story"
            />
          </a-col>
          <a-col :xs="24" :md="12">
            <h2 class="section-title">关于我们</h2>
            <p class="text-content">
              自2020年创立以来，我们始终秉持着“不妥协”的制表理念。在这个快节奏的数字时代，我们渴望通过机械的律动，找回时间的质感。
            </p>
            <p class="text-content">
              我们的设计灵感源自浩瀚星空与建筑美学，将现代科技与传统工艺完美融合。这不仅仅是一块手表，更是您身份与品味的象征。我们相信，一块好的腕表，能陪伴您走过人生每一个重要时刻。
            </p>
            <a-button type="primary" size="large" shape="round" style="margin-top: 20px;">
              联系我们
            </a-button>
          </a-col>
        </a-row>
      </section>

      <a-divider />

      <section class="section">
        <div class="center-header">
          <h2 class="section-title">为什么选择我们</h2>
          <p class="section-subtitle">品质与服务是我们永恒的承诺</p>
        </div>

        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :sm="12" :md="6" v-for="(item, index) in features" :key="index">
            <a-card hoverable class="feature-card">
              <div class="icon-wrapper">
                <component :is="item.icon" class="feature-icon" />
              </div>
              <h3 class="feature-title">{{ item.title }}</h3>
              <p class="feature-desc">{{ item.desc }}</p>
            </a-card>
          </a-col>
        </a-row>
      </section>

      <section class="section history-section">
        <div class="center-header">
          <h2 class="section-title">发展历程</h2>
        </div>
        <div class="timeline-container">
          <a-timeline mode="alternate">
            <a-timeline-item v-for="(item, i) in history" :key="i">
              <template #dot>
                <div class="custom-dot"></div>
              </template>
              <div class="timeline-content">
                <span class="year-badge">{{ item.year }}</span>
                <h4 style="margin: 8px 0 4px;">{{ item.title }}</h4>
                <p style="color: #666; font-size: 13px;">{{ item.desc }}</p>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* 全局容器 */
.about-page {
  background-color: #fcfcfc;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 1. 顶部 Hero Banner */
.hero-section {
  height: 300px;
  background: linear-gradient(45deg, #1a1a1a, #434343);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 40px;
}

.hero-overlay h1 {
  color: #fff;
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 4px;
  margin-bottom: 10px;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 300;
}

/* 通用 Section 样式 */
.section {
  padding: 40px 0;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  position: relative;
}

.center-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-subtitle {
  color: #888;
  font-size: 14px;
}

/* 2. 品牌故事 */
.story-img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.text-content {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 16px;
  text-align: justify;
}

/* 3. 核心价值 */
.feature-card {
  text-align: center;
  height: 100%;
  border: none;
  background: #fff;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: #f0f5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-icon {
  font-size: 28px;
  color: #1890ff;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.feature-desc {
  color: #888;
  font-size: 13px;
}

/* 4. 发展历程 */
.history-section {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  margin-top: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.custom-dot {
  width: 10px;
  height: 10px;
  background: #1890ff;
  border-radius: 50%;
  border: 2px solid #d6e4ff;
}

.year-badge {
  background: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-section {
    height: 200px;
  }
  .hero-title {
    font-size: 24px;
  }
  .story-img {
    height: 200px;
    margin-bottom: 20px;
  }
  .section-title {
    font-size: 22px;
  }
}
</style>