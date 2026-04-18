<script setup>
import item1Image from '../assets/item1.jpg'
import item2Image from '../assets/item2.jpg'
</script>

<template>

    <div class="about-page">
        <div class="hero-header">
            <div class="hero-bg"
                style="background-image: url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')">
            </div>
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1>我们的传承</h1>
                <p>用一个世纪书写重要时刻。</p>
            </div>
        </div>
        <div class="container section">
            <div class="content-block">
                <span class="eyebrow">起点</span>
                <h2>卓越的源起</h2>
                <p>怀着重新定义制表边界的坚定愿景，精准之路 用数十年时间甄选来自世界各地的非凡时计。我们的旅程始于一间小小的工坊，由对机械之美与艺术表达的热爱所驱动。</p>
            </div>
        </div>

        <div class="image-break">
            <div class="image-item"
                :style="{ backgroundImage: `url(${item1Image})` }">
            </div>
            <div class="image-item"
                :style="{ backgroundImage: `url(${item2Image})` }">
            </div>
        </div>

        <div class="container section">
            <div class="content-block right">
                <span class="eyebrow">理念</span>
                <h2>恒久的价值</h2>
                <p>我们相信，腕表不只是丈量时间的工具，更是陪伴人生的重要伙伴。系列中的每一枚作品，都因其超越潮流的气质而被选中，见证着历久弥新的风格与工艺。</p>
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
    background: rgba(0, 0, 0, 0.5);
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
    color: rgba(255, 255, 255, 0.9);
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
