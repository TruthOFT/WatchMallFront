<template>
  <div class="about-page">
    <div class="hero-header">
      <div class="hero-bg" style="background-image: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Our Legacy</h1>
        <p>A century of defining moments.</p>
      </div>
    </div>

    <div class="container section">
      <div class="content-block">
        <span class="eyebrow">THE BEGINNING</span>
        <h2>Origins of Excellence</h2>
        <p>Founded with a singular vision to redefine the boundaries of horology, WatchMall has spent decades curating the world's most exceptional timepieces. Our journey began in a small atelier, driven by a passion for mechanical perfection and artistic expression.</p>
      </div>
    </div>

    <div class="image-break">
      <div class="image-item" style="background-image: url('https://images.unsplash.com/photo-1590736969955-71cc94801759?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')"></div>
      <div class="image-item" style="background-image: url('https://images.unsplash.com/photo-1587925358603-c2fea45817c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')"></div>
    </div>

    <div class="container section">
      <div class="content-block right">
        <span class="eyebrow">THE PHILOSOPHY</span>
        <h2>Timeless Values</h2>
        <p>We believe that a watch is more than an instrument to measure time; it is a companion for life. Every piece in our collection is selected for its ability to transcend trends and stand as a testament to enduring style and craftsmanship.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  background-color: var(--color-bg-main);
}

.hero-header {
  height: 60vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-content h1 {
  font-size: 4rem;
  color: #fff;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 1.5rem;
  font-family: var(--font-heading);
  font-style: italic;
  color: rgba(255,255,255,0.9);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 120px 0;
}

.content-block {
  max-width: 600px;
}

.content-block.right {
  margin-left: auto;
  text-align: right;
}

.eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--color-cta);
  margin-bottom: 24px;
  font-weight: 600;
}

.content-block h2 {
  font-size: 2.5rem;
  margin-bottom: 32px;
}

.content-block p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-secondary);
}

.image-break {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 600px;
}

.image-item {
  background-size: cover;
  background-position: center;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .image-break {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .image-item {
    height: 300px;
  }
}
</style>
