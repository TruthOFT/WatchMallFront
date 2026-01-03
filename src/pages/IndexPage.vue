<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RightOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// --- 数据接口接口 (待对接) ---
const categoryList = ref<any[]>([]);
const banners = ref<any[]>([]);
const heroProduct = ref<any>({});
const productList = ref<any[]>([]);

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return new URL(url, import.meta.url).href;
};

const goToDetail = (id: string | number) => {
  console.log('正在跳转至产品 ID:', id);
  // router.push({ name: 'ProductDetail', params: { id } });
};

const fetchData = async () => {
  // 这里未来替换为 axios.get('/api/home')
  categoryList.value = [
    { id: 1, img: "../assets/watches/w1.jpg", name: "机械表", desc: "经典工艺传承" },
    { id: 2, img: "../assets/watches/w2.jpg", name: "电子表", desc: "科技定义时间" },
    { id: 3, img: "../assets/watches/w3.jpg", name: "石英表", desc: "精准无暇表现" },
    { id: 4, img: "../assets/watches/w3.jpg", name: "配件", desc: "个性化表带与周边" },
    { id: 5, img: "../assets/watches/w1.jpg", name: "男士系列", desc: "硬朗绅士风范" },
    { id: 6, img: "../assets/watches/w2.jpg", name: "女士系列", desc: "优雅精致之选" }
  ];
  heroProduct.value = {
    id: 99,
    title: "精钢系列新品",
    desc: "100小时极致打磨",
    img: "../assets/watches/w1.jpg"
  };
  banners.value = [
    { id: 101, img: "../assets/watches/w1.jpg", title: "Precision Pro", sub: "全新一代机械机芯" },
    { id: 102, img: "../assets/watches/w2.jpg", title: "简约，不凡", sub: "极简主义设计" }
  ];
  productList.value = [
    { id: 201, name: "Series 1", price: "2,499", img: "../assets/watches/w1.jpg", tag: "多种颜色可选" },
    { id: 202, name: "Series 2", price: "3,199", img: "../assets/watches/w2.jpg", tag: "年度热销" },
    { id: 203, name: "Series 3", price: "4,599", img: "../assets/watches/w3.jpg", tag: "专业潜水" },
    { id: 204, name: "Series 4", price: "5,299", img: "../assets/watches/w1.jpg", tag: "商务首选" },
  ];
};

onMounted(fetchData);
</script>

<template>
  <div class="home-container">

    <div class="section-box">
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in categoryList" :key="item.id" :xs="12" :sm="8" :md="4">
          <a-card hoverable @click="goToDetail(item.id)">
            <template #cover>
              <img :alt="item.name" :src="getImageUrl(item.img)" class="card-img-top" />
            </template>
            <a-card-meta :title="item.name">
              <template #description>{{ item.desc }}</template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <div class="section-box" v-if="heroProduct.id">
      <a-card hoverable @click="goToDetail(heroProduct.id)" :body-style="{ textAlign: 'center' }">
        <template #cover>
          <img :alt="heroProduct.title" :src="getImageUrl(heroProduct.img)" class="hero-card-img" />
        </template>
        <a-card-meta>
          <template #title>
            <span class="hero-title">{{ heroProduct.title }}</span>
          </template>
          <template #description>
            <span class="hero-desc">{{ heroProduct.desc }}</span>
            <div style="margin-top: 15px">
              <a-button type="primary" shape="round">立即购买</a-button>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <div class="section-box">
      <a-carousel autoplay effect="fade">
        <div v-for="banner in banners" :key="banner.id">
          <a-card :bordered="false" class="banner-card" @click="goToDetail(banner.id)">
            <div class="banner-content" :style="{ backgroundImage: `url(${getImageUrl(banner.img)})` }">
              <div class="banner-text">
                <h2>{{ banner.title }}</h2>
                <p>{{ banner.sub }}</p>
              </div>
            </div>
          </a-card>
        </div>
      </a-carousel>
    </div>

    <div class="section-box">
      <a-typography-title :level="2" style="margin-bottom: 25px">挑选你的风格</a-typography-title>
      <a-row :gutter="[20, 20]">
        <a-col :span="12" :md="6" v-for="product in productList" :key="product.id">
          <a-card hoverable @click="goToDetail(product.id)">
            <template #cover>
              <img :alt="product.name" :src="getImageUrl(product.img)" class="product-card-img" />
            </template>
            <a-card-meta :title="product.name">
              <template #description>
                <div class="product-tag">{{ product.tag }}</div>
                <div class="product-price">RMB {{ product.price }} 起</div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fbfbfd;
}

.section-box {
  margin-bottom: 50px;
}

/* 统一控制卡片图片的展示 */
.card-img-top {
  height: 140px;
  object-fit: cover;
}

.hero-card-img {
  height: 400px;
  object-fit: contain;
  background: #fff;
  padding: 40px 0;
}

.hero-title {
  font-size: 28px;
  font-weight: 600;
}


.product-tag {
  font-size: 12px;
  color: #86868b;
}

.product-price {
  color: #1d1d1f;
  font-weight: 500;
  margin-top: 4px;
}

.banner-card {
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.banner-content {
  height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 40px;
}

.banner-text {
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.banner-text h2 { color: white; font-size: 32px; margin-bottom: 8px; }

:deep(.ant-card-meta-title) {
  margin-bottom: 8px !important;
}
</style>