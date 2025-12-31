<script setup lang="ts">
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

// 轮播图数据
const bannerData = [
  { img: "../assets/watches/w1.jpg", title: "新品上市" },
  { img: "../assets/watches/w2.jpg", title: "全场八折" },
  { img: "../assets/watches/w3.jpg", title: "尊享品质" }
]
</script>

<template>
  <div style="padding: 20px;">
    <!-- 第一部分：卡片排版（保持不动） -->
    <a-row :gutter="[12, 12]">
      <a-col
          v-for="(item, index) in data"
          :key="index"
          :xs="12" :sm="8" :md="4"
      >
        <a-card hoverable size="small">
          <template #cover>
            <img
                :alt="item.name"
                :src="getImageUrl(item.img)"
                style="height: 120px; object-fit: cover"
            />
          </template>

          <a-card-meta>
            <template #title>
              <span style="font-size: 14px;">{{ item.name }}</span>
            </template>
            <template #description>
              <div class="desc-text">精选商品</div>
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <!-- 第二部分：下方新增轮播图 -->
    <div class="carousel-container">
      <a-carousel autoplay>
        <div v-for="(banner, bIndex) in bannerData" :key="bIndex">
          <div
              class="carousel-slide"
              :style="{ backgroundImage: `url(${getImageUrl(banner.img)})` }"
          >
            <div class="banner-overlay">
              <h2>{{ banner.title }}</h2>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<style scoped>
/* 原有卡片样式 */
.desc-text {
  font-size: 12px;
  color: #999;
}

:deep(.ant-card-body) {
  padding: 8px !important;
}

/* 新增轮播图样式 */
.carousel-container {
  margin-top: 30px; /* 与上方卡片的间距 */
  border-radius: 12px;
  overflow: hidden; /* 保证圆角生效 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.carousel-slide {
  height: 280px; /* 轮播图高度 */
  background-size: cover;
  background-position: center;
  position: relative;
}

/* 文字遮罩层，让文字更清晰 */
.banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.banner-overlay h2 {
  color: white;
  font-size: 24px;
  margin: 0;
}

/* 调整轮播图指示点样式（可选） */
:deep(.ant-carousel .slick-dots) {
  bottom: 10px;
}
</style>