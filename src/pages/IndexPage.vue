<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingOutlined, RightOutlined } from '@ant-design/icons-vue';

// 适配 Vite 的静态资源路径处理
const getImageUrl = (url: string) => {
  return new URL(url, import.meta.url).href;
};

const data = [
  { img: "../assets/watches/w1.jpg", name: "机械表" },
  { img: "../assets/watches/w2.jpg", name: "电子表" },
  { img: "../assets/watches/w3.jpg", name: "石英表" },
  { img: "../assets/watches/w3.jpg", name: "配件" },
  { img: "../assets/watches/w1.jpg", name: "男士系列" },
  { img: "../assets/watches/w2.jpg", name: "女士系列" }
]

const bannerData = [
  { img: "../assets/watches/w1.jpg", title: "Precision Pro", sub: "全新一代机械机芯，定义精准。" },
  { img: "../assets/watches/w2.jpg", title: "简约，不凡", sub: "极简主义设计，佩戴从未如此舒适。" },
  { img: "../assets/watches/w3.jpg", title: "经典永恒", sub: "致敬传统工艺，传承时间美学。" }
]

// 新增：深度体验商品（苹果风大块）
const featuredWatch = {
  title: "精钢系列",
  desc: "每一个零件，都经过 100 小时以上的极致打磨。",
  img: "../assets/watches/w1.jpg"
}
</script>

<template>
  <div class="home-wrapper">
    <div class="section-container">
      <a-row :gutter="[12, 12]">
        <a-col v-for="(item, index) in data" :key="index" :xs="12" :sm="8" :md="4">
          <a-card hoverable size="small" class="apple-card">
            <template #cover>
              <img :alt="item.name" :src="getImageUrl(item.img)" style="height: 120px; object-fit: cover" />
            </template>
            <a-card-meta>
              <template #title>
                <span class="card-title">{{ item.name }}</span>
              </template>
              <template #description>
                <div class="desc-text">探索系列 <RightOutlined style="font-size: 10px" /></div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="apple-hero">
      <div class="hero-text">
        <span class="new-tag">新品</span>
        <h1>{{ featuredWatch.title }}</h1>
        <p>{{ featuredWatch.desc }}</p>
        <div class="hero-btns">
          <a-button type="primary" shape="round" size="large">立即购买</a-button>
          <a-button type="link" size="large">了解更多 ></a-button>
        </div>
      </div>
      <div class="hero-img-box">
        <img :src="getImageUrl(featuredWatch.img)" />
      </div>
    </div>

    <div class="carousel-container">
      <a-carousel autoplay effect="fade">
        <div v-for="(banner, bIndex) in bannerData" :key="bIndex">
          <div class="carousel-slide" :style="{ backgroundImage: `url(${getImageUrl(banner.img)})` }">
            <div class="banner-overlay">
              <div class="overlay-content">
                <h2>{{ banner.title }}</h2>
                <p>{{ banner.sub }}</p>
              </div>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>

    <div class="section-container">
      <div class="section-header">
        <h2>挑选你的风格</h2>
      </div>
      <a-row :gutter="[20, 20]">
        <a-col :span="12" :md="6" v-for="i in 4" :key="i">
          <div class="product-item">
            <div class="img-wrap">
               <img :src="getImageUrl('../assets/watches/w'+(i%3+1)+'.jpg')" />
            </div>
            <div class="item-info">
              <div class="item-tag">多种颜色可选</div>
              <div class="item-name">精准之路 Series {{i}}</div>
              <div class="item-price">RMB 2,499 起</div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.home-wrapper {
  background-color: #fbfbfd;
  padding-bottom: 60px;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.apple-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
}
.desc-text {
  font-size: 12px;
  color: #06c;
}

.apple-hero {
  background-color: #fff;
  margin: 20px 0;
  padding: 60px 20px;
  text-align: center;
}
.new-tag { color: #f56300; font-weight: 600; font-size: 14px; }
.hero-text h1 { font-size: 48px; font-weight: 600; margin: 10px 0; }
.hero-text p { font-size: 20px; color: #86868b; margin-bottom: 24px; }
.hero-img-box img {
  max-width: 500px;
  width: 100%;
  margin-top: 30px;
  transition: transform 0.5s;
}
.hero-img-box:hover img { transform: scale(1.03); }

.carousel-container {
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.carousel-slide {
  height: 450px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: flex-end;
  padding: 60px;
}
.overlay-content h2 { color: white; font-size: 40px; font-weight: 600; margin: 0; }
.overlay-content p { color: white; font-size: 18px; opacity: 0.9; }

.section-header h2 { font-size: 28px; font-weight: 600; margin: 40px 0 20px; }
.product-item { background: white; border-radius: 18px; padding: 30px; text-align: center; cursor: pointer; }
.img-wrap img { width: 100%; height: 160px; object-fit: contain; margin-bottom: 20px; }
.item-tag { font-size: 12px; color: #bfbfbf; margin-bottom: 4px; }
.item-name { font-size: 16px; font-weight: 600; color: #1d1d1f; }
.item-price { font-size: 14px; color: #1d1d1f; margin-top: 8px; }

:deep(.ant-carousel .slick-dots) { bottom: 20px; }
</style>