<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {home} from "@/api/productController";
const router = useRouter();

const categoryList = ref<any[]>([]);
const banners = ref<any[]>([]);
const heroProduct = ref<any>({});
const productList = ref<any[]>([]);
const compareList = ref<any[]>([]);
const extraList = ref<any[]>([]);

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return new URL(url, import.meta.url).href;
};

const goToDetail = (id: number | string) => {
  // router.push({ name: 'ProductDetail', params: { id } });
  console.log('go detail', id);
};

const fetchData = async () => {
  const res = await home();
  if (res.code === 0) {
    categoryList.value = res.data.categoryVOList;
    heroProduct.value = res.data.productVO;
  }

  heroProduct.value = {
    id: 100,
    title: '专注每一刻',
    desc: '为商务与生活打造的高品质腕表',
    img: '../assets/watches/w1.jpg'
  };

  banners.value = [
    { id: 1, title: '匠心工艺', sub: '机械之美', img: '../assets/watches/w1.jpg' },
    { id: 2, title: '精准生活', sub: '石英腕表', img: '../assets/watches/w2.jpg' }
  ];

  productList.value = [
    { id: 201, name: 'Classic One', price: '2,499', tag: '商务首选', img: '../assets/watches/w1.jpg' },
    { id: 202, name: 'Urban Pro', price: '3,199', tag: '年度热销', img: '../assets/watches/w2.jpg' },
    { id: 203, name: 'Diver X', price: '4,599', tag: '专业防水', img: '../assets/watches/w3.jpg' },
    { id: 204, name: 'Minimal S', price: '5,299', tag: '简约设计', img: '../assets/watches/w1.jpg' }
  ];

  // Apple 风格三大主推
  compareList.value = [
    {
      id: 301,
      name: 'Classic Pro',
      price: '￥3,999 起',
      img: '../assets/watches/w1.jpg',
      features: ['自动机械机芯', '商务佩戴', '50m 防水', '不锈钢表壳']
    },
    {
      id: 302,
      name: 'Quartz Lite',
      price: '￥2,499 起',
      img: '../assets/watches/w2.jpg',
      features: ['高精度石英', '轻薄设计', '长效续航', '多色可选']
    },
    {
      id: 303,
      name: 'Smart Active',
      price: '￥4,999 起',
      img: '../assets/watches/w3.jpg',
      features: ['健康监测', '心率/睡眠', 'GPS 定位', '运动防水']
    }
  ];

  extraList.value = [
    { id: 401, name: '智能腕表', desc: '健康监测', img: '../assets/watches/w2.jpg' },
    { id: 402, name: '真皮表带', desc: '多种风格', img: '../assets/watches/w3.jpg' },
    { id: 403, name: '运动表带', desc: '舒适耐用', img: '../assets/watches/w1.jpg' },
    { id: 404, name: '旅行表盒', desc: '收纳保护', img: '../assets/watches/w2.jpg' }
  ];
};

onMounted(fetchData);
</script>

<template>
  <div class="home-container">

    <!-- 分类 -->
    <div class="section-box">
      <a-row :gutter="[16,16]">
        <a-col v-for="c in categoryList" :key="c.id" :xs="12" :md="6">
          <a-card hoverable @click="goToDetail(c.id)">
            <template #cover>
              <img :src="getImageUrl(c.img)" class="card-img-top"/>
            </template>
            <a-card-meta :title="c.categoryName" :description="c.description"/>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Hero -->
    <div class="section-box">
      <a-card hoverable :body-style="{ textAlign: 'center' }">
        <template #cover>
          <img :src="getImageUrl(heroProduct.img)" class="hero-card-img"/>
        </template>
        <a-card-meta>
          <template #title>
            <span class="hero-title">{{ heroProduct.title }}</span>
          </template>
          <template #description>
            {{ heroProduct.desc }}
            <div style="margin-top:16px">
              <a-button type="primary" shape="round">探索系列</a-button>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <!-- Banner -->
    <div class="section-box">
      <a-carousel autoplay>
        <div v-for="b in banners" :key="b.id">
          <div class="banner" :style="{backgroundImage:`url(${getImageUrl(b.img)})`}">
            <h2>{{ b.title }}</h2>
            <p>{{ b.sub }}</p>
          </div>
        </div>
      </a-carousel>
    </div>

    <!-- 精选 -->
    <div class="section-box">
      <a-typography-title :level="2">精选腕表</a-typography-title>
      <a-row :gutter="[20,20]">
        <a-col v-for="p in productList" :key="p.id" :span="12" :md="6">
          <a-card hoverable @click="goToDetail(p.id)">
            <template #cover>
              <img :src="getImageUrl(p.img)" class="product-card-img"/>
            </template>
            <a-card-meta :title="p.name">
              <template #description>
                <div class="product-tag">{{ p.tag }}</div>
                <div class="product-price">￥{{ p.price }} 起</div>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- Apple 风格主推对比 -->
    <div class="section-box">
      <a-typography-title :level="2" class="center">
        哪一款腕表适合你？
      </a-typography-title>

      <a-row :gutter="[32,32]">
        <a-col v-for="item in compareList" :key="item.id" :xs="24" :md="8">
          <div class="compare-card">
            <img :src="getImageUrl(item.img)" class="compare-img"/>
            <div class="compare-name">{{ item.name }}</div>
            <div class="compare-price">{{ item.price }}</div>
            <ul class="feature-list">
              <li v-for="f in item.features" :key="f">{{ f }}</li>
            </ul>
            <a-button type="link" @click="goToDetail(item.id)">进一步了解</a-button>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 推荐配件 -->
    <div class="section-box">
      <a-typography-title :level="3">推荐搭配 · 精选配件</a-typography-title>
      <a-row :gutter="[20,20]">
        <a-col v-for="e in extraList" :key="e.id" :span="12" :md="6">
          <a-card hoverable @click="goToDetail(e.id)">
            <template #cover>
              <img :src="getImageUrl(e.img)" class="extra-card-img"/>
            </template>
            <a-card-meta :title="e.name" :description="e.desc"/>
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
  background: #fbfbfd;
}
.section-box { margin-bottom: 60px; }
.center { text-align: center; }

.card-img-top { height: 140px; object-fit: cover; }
.hero-card-img { height: 420px; object-fit: contain; background:#fff; }
.hero-title { font-size: 30px; font-weight: 600; }

.banner {
  height: 360px;
  background-size: cover;
  background-position: center;
  padding: 40px;
  color: #fff;
}

.product-card-img { height: 200px; object-fit: contain; background:#fff; }
.product-tag { font-size: 12px; color: #86868b; }
.product-price { margin-top: 4px; font-weight: 500; }

.compare-card { text-align: center; }
.compare-img { height: 260px; object-fit: contain; }
.compare-name { font-size: 20px; font-weight: 600; }
.compare-price { color: #86868b; margin-bottom: 16px; }

.feature-list { list-style: none; padding: 0; }
.feature-list li { padding: 6px 0; border-bottom: 1px solid #eee; }

.extra-card-img { height: 180px; object-fit: contain; background:#fff; }
</style>
