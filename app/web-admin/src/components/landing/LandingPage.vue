<template>
  <div class="landing-page">
    <Navbar />
    <HeroSection />
    <Partners />
    <PetCards />
    <SuccessStories />
    
    <div class="cta-section">
      <div class="cta-content">
         <h2>Ready to Open Your Heart?</h2>
         <p>There are thousands of pets waiting for a hero like you.</p>
         <a-button type="primary" size="large" shape="round" class="cta-btn">Start Adoption Journey</a-button>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue';
import HeroSection from './HeroSection.vue';
import Partners from './Partners.vue';
import PetCards from './PetCards.vue';
import SuccessStories from './SuccessStories.vue';
import AppFooter from './AppFooter.vue';
</script>

<style scoped>
.landing-page {
  background-color: var(--background);
  min-height: 100vh;
}

.cta-section {
    padding: 100px 20px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    text-align: center;
    color: white;
}

.cta-content h2 {
    color: white;
    font-size: 3rem;
    margin-bottom: 20px;
}

.cta-content p {
    font-size: 1.25rem;
    margin-bottom: 40px;
    opacity: 0.9;
}

.cta-btn {
    height: 56px;
    padding: 0 40px;
    font-size: 1.1rem;
    background-color: white !important;
    color: var(--primary) !important;
    border: none !important;
    font-weight: 700;
}

.cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
</style>
