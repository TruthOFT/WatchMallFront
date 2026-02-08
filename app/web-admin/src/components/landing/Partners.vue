<template>
  <div class="partners-section">
    <div class="content-wrapper">
      <p class="partners-title">Trusted by shelters across the country</p>
      <div class="logos-grid">
         <div v-for="i in 5" :key="i" class="partner-logo">
            Shelter {{ i }}
         </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.partners-section {
  padding: 40px 20px;
  background-color: white;
  border-top: 1px solid #fed7aa;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.partners-title {
    color: #9a3412;
    margin-bottom: 20px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.875rem;
}

.logos-grid {
    display: flex;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    opacity: 0.6;
}

.partner-logo {
    font-weight: 800;
    font-size: 1.5rem;
    color: #cbd5e1;
}
</style>
