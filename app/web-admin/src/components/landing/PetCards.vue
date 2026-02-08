<template>
  <div class="pet-cards-section">
    <div class="section-header">
      <h2 class="section-title">Meet Our Newest Friends</h2>
      <p class="section-subtitle">These cuties are looking for a forever home right now.</p>
    </div>

    <a-row :gutter="[24, 24]" justify="center">
      <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(pet, index) in pets" :key="pet.id">
        <a-card hoverable class="pet-card fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
          <template #cover>
            <div class="card-cover" :style="{ backgroundColor: pet.bgColor }">
              <span class="pet-emoji">{{ pet.emoji }}</span>
              <div class="pet-status" v-if="pet.status">{{ pet.status }}</div>
            </div>
          </template>
          <a-card-meta :title="pet.name">
            <template #description>
              <div class="pet-info">
                <span>{{ pet.breed }}</span>
                <span>•</span>
                <span>{{ pet.age }}</span>
              </div>
              <div class="pet-tags">
                 <a-tag v-for="tag in pet.tags" :key="tag" :color="tagColor(tag)">{{ tag }}</a-tag>
              </div>
            </template>
          </a-card-meta>
          <div class="adopt-btn-wrapper">
             <a-button type="primary" block shape="round">Adopt Me</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <div class="view-more-container">
        <a-button size="large" type="default" shape="round">View All Pets</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const pets = [
  { id: 1, name: 'Bella', breed: 'Labrador Mix', age: '2 yrs', emoji: '🐕', bgColor: '#ffedd5', tags: ['Friendly', 'Active'], status: 'New' },
  { id: 2, name: 'Luna', breed: 'Siamese', age: '1 yr', emoji: '🐈', bgColor: '#e0f2fe', tags: ['Calm', 'Indoor'], status: '' },
  { id: 3, name: 'Charlie', breed: 'Golden Retriever', age: '3 mos', emoji: '🦮', bgColor: '#fef3c7', tags: ['Puppy', 'Playful'], status: 'Urgent' },
  { id: 4, name: 'Lucy', breed: 'Beagle', age: '4 yrs', emoji: '🐕‍🦺', bgColor: '#dcfce7', tags: ['Loyal', 'Good with Kids'], status: '' },
  { id: 5, name: 'Max', breed: 'Tabby', age: '5 yrs', emoji: '🐈‍⬛', bgColor: '#f3e8ff', tags: ['Chill', 'House Trained'], status: '' },
  { id: 6, name: 'Daisy', breed: 'Poodle', age: '2 yrs', emoji: '🐩', bgColor: '#ffe4e6', tags: ['Hypoallergenic', 'Smart'], status: '' },
  { id: 7, name: 'Rocky', breed: 'Bulldog', age: '3 yrs', emoji: '🐕', bgColor: '#f1f5f9', tags: ['Lazy', 'Sweet'], status: '' },
  { id: 8, name: 'Milo', breed: 'Maine Coon', age: '2 yrs', emoji: '🐱', bgColor: '#fff7ed', tags: ['Fluffy', 'Giant'], status: '' },
];

const tagColor = (tag: string) => {
    if(tag === 'Puppy' || tag === 'Urgent') return 'red';
    if(tag === 'Friendly' || tag === 'Playful') return 'green';
    return 'blue';
}
</script>

<style scoped>
.pet-cards-section {
  padding: 60px 20px;
  background-color: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.5rem;
  color: #431407;
  margin-bottom: 10px;
}

.section-subtitle {
  color: #78350f;
  font-size: 1.1rem;
}

.pet-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #fed7aa;
}

.pet-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: var(--primary);
}

.card-cover {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pet-emoji {
  font-size: 80px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  transition: transform 0.3s;
}

.pet-card:hover .pet-emoji {
    transform: scale(1.1) rotate(5deg);
}

.pet-status {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    color: var(--primary);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pet-info {
  display: flex;
  gap: 8px;
  color: #64748b;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.pet-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
    min-height: 44px; /* maintain height */
}

.adopt-btn-wrapper {
    margin-top: 15px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s;
}

.pet-card:hover .adopt-btn-wrapper {
    opacity: 1;
    transform: translateY(0);
}

.view-more-container {
    text-align: center;
    margin-top: 40px;
}
</style>
