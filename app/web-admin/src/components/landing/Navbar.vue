<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <div class="logo">PawConnect 🐾</div>
      <div class="nav-links desktop-only">
        <a href="#" class="active">Home</a>
        <a href="#">Find a Pet</a>
        <a href="#">Shelters</a>
        <a href="#">Success Stories</a>
      </div>
      <div class="nav-actions">
        <router-link to="/login">
          <a-button type="text" class="desktop-only">Log In</a-button>
        </router-link>
        <a-button type="primary" shape="round">Donate</a-button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.3s ease;
  background-color: transparent;
}

.navbar.scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: var(--text);
  font-weight: 600;
  font-size: 1rem;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--primary);
}

.nav-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}
</style>
