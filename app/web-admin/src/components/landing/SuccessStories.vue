<template>
  <div class="success-stories-section">
    <div class="content-wrapper">
      <h2 class="section-title">Happy Tails</h2>
      <a-row :gutter="[40, 40]">
        <a-col :xs="24" :md="12" v-for="story in stories" :key="story.id">
          <div class="story-card">
            <div class="story-image-placeholder" :style="{ backgroundColor: story.color }">
                <span style="font-size: 40px;">{{ story.emoji }}</span>
            </div>
            <div class="story-content">
              <p class="story-text">"{{ story.text }}"</p>
              <h4 class="story-author">- {{ story.author }} & {{ story.petName }}</h4>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const stories = [
  { id: 1, text: "Adopting Luna changed my life. She's the sweetest companion I could ask for!", author: "Sarah M.", petName: "Luna", color: "#fef3c7", emoji: "👩‍❤️‍💋‍👨" },
  { id: 2, text: "The process was so smooth and the staff really cares. Max is settling in perfectly.", author: "James T.", petName: "Max", color: "#dcfce7", emoji: "🏠" },
];
</script>

<style scoped>
.success-stories-section {
  padding: 80px 20px;
  background-color: #fff7ed;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #431407;
}

.story-card {
  background: white;
  padding: 30px;
  border-radius: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.story-card:hover {
    transform: scale(1.02);
}

.story-image-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.story-text {
  font-style: italic;
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 10px;
}

.story-author {
  font-weight: bold;
  color: var(--primary);
  margin: 0;
}

@media (max-width: 600px) {
    .story-card {
        flex-direction: column;
        text-align: center;
    }
}
</style>
