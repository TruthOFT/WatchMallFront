<template>
  <div class="hero-section">
    <a-row type="flex" align="middle" justify="center" style="min-height: 80vh;">
      <a-col :xs="24" :md="12" class="hero-content">
        <h1 class="hero-title fade-in-up" style="animation-delay: 0.1s;">
          Find Your New <span style="color: var(--primary)">Best Friend</span>
        </h1>
        <p class="hero-subtitle fade-in-up" style="animation-delay: 0.2s;">
          Connect with shelter pets waiting for a loving home. <br>
          Adopting is one of the best things you can do.
        </p>
        
        <div class="search-box fade-in-up" style="animation-delay: 0.3s;">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Search by breed, age, or name..."
            enter-button="Find a Pet"
            size="large"
            @search="onSearch"
            class="custom-search"
          />
          <div class="quick-filters">
            <a-tag color="orange">Dogs</a-tag>
            <a-tag color="orange">Cats</a-tag>
            <a-tag color="orange">Puppies</a-tag>
            <a-tag color="orange">Senior Pets</a-tag>
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :md="10" class="hero-image-col fade-in-up" style="animation-delay: 0.4s;">
        <div class="image-wrapper animate-float">
           <!-- Placeholder for Hero Image -->
           <div style="background-color: #ffecd1; width: 100%; height: 400px; border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 20px 40px rgba(249, 115, 22, 0.2);">
             <span style="font-size: 80px;">🐶</span>
           </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');

const onSearch = (value: string) => {
  console.log('Searching for:', value);
};
</script>

<style scoped>
.hero-section {
  padding: 40px 20px;
  background: radial-gradient(circle at top right, #fff7ed, #ffffff);
  overflow: hidden;
}

.hero-content {
  padding: 20px;
  text-align: left;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #431407; /* Darker brown for contrast */
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #78350f;
  margin-bottom: 40px;
  max-width: 500px;
}

.search-box {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  max-width: 500px;
}

.custom-search :deep(.ant-input) {
  border-radius: 8px 0 0 8px;
  border-color: #fed7aa;
}

.custom-search :deep(.ant-input:hover),
.custom-search :deep(.ant-input:focus) {
  border-color: var(--primary);
}

.custom-search :deep(.ant-btn-primary) {
  border-radius: 0 8px 8px 0;
  background-color: var(--primary);
  border-color: var(--primary);
  height: 40px;
  font-weight: 600;
}

.quick-filters {
  margin-top: 15px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.hero-image-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    text-align: center;
  }
  .hero-subtitle {
    text-align: center;
    margin: 0 auto 30px;
  }
  .hero-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
