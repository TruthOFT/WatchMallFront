<template>
  <div class="faq-page">
    <div class="container">
      <div class="page-header">
        <span class="eyebrow">专属咨询</span>
        <h1>常见问题</h1>
        <p>为尊贵的收藏家提供详尽指引。</p>
      </div>

      <div class="faq-container">
        <div class="liquid-glass faq-card">
          <a-collapse v-model:activeKey="activeKey" ghost expand-icon-position="right">
            <template #expandIcon="{ isActive }">
              <plus-outlined v-if="!isActive" />
              <minus-outlined v-else />
            </template>
            
            <a-collapse-panel v-for="faq in faqs" :key="faq.id" :header="faq.question">
              <p class="faq-answer">{{ faq.answer }}</p>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>

      <div class="contact-cta">
        <p>仍有疑问？</p>
        <router-link to="/support">
          <a-button type="link" class="concierge-link">联系我们的私人礼宾</a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';

const activeKey = ref(['1']);

const faqs = ref([
  {
    id: '1',
    question: "WatchMall 售出的时计是正品吗？",
    answer: "是的，WatchMall 售出的每一枚时计均保证 100% 正品。我们直接与授权零售商和享有盛誉的收藏家合作，确保每一枚腕表的来源可靠。所有购买均附带原装表盒、证书及 WatchMall 出具的真品保证书。"
  },
  {
    id: '2',
    question: "你们的配送与保险政策是什么？",
    answer: "我们为全球范围内的订单提供免费的全额保险优先配送。每份包裹都经过精细且私密的包装，送达时需成年人亲笔签收。高价值时计将由专门的安全快递公司负责运送。"
  },
  {
    id: '3',
    question: "是否提供国际配送服务？",
    answer: "我们支持全球超过 50 个国家和地区的配送。请注意，国际订单可能会产生进口关税及税费，这些费用需由客户承担。我们的礼宾团队可应要求为您提供预估费用。"
  },
  {
    id: '4',
    question: "腕表提供什么样的保修服务？",
    answer: "全新腕表享有品牌官方提供的全球联保。二手时计则涵盖 WatchMall 提供的 24 个月机械保修服务，保障在正常使用情况下的机芯缺陷。"
  },
  {
    id: '5',
    question: "如果腕表不符合预期，可以退货吗？",
    answer: "我们提供 14 天的尊享退货期。前提是腕表必须保持出售时的原始状态，所有封条及标签完好无损。在经过我们的高级制表师严格检验后，我们将处理退款事宜。"
  }
]);
</script>

<style scoped>
.faq-page {
  padding: 160px 0 100px;
  background-color: var(--color-bg-main);
  min-height: 100vh;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.page-header p {
  color: var(--color-secondary);
  font-size: 1.2rem;
  font-family: var(--font-heading);
}

.eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-cta);
  margin-bottom: 16px;
  font-weight: 600;
}

.faq-container {
  margin-bottom: 60px;
}

.faq-card {
  padding: 24px;
}

:deep(.ant-collapse-header) {
  font-family: var(--font-heading) !important;
  font-size: 1.4rem !important;
  font-weight: 500 !important;
  color: var(--color-primary) !important;
  padding: 24px 0 !important;
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.faq-answer {
  color: var(--color-secondary);
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 8px 0 24px;
}

.contact-cta {
  text-align: center;
  color: var(--color-secondary);
  font-size: 1.1rem;
}

.concierge-link {
  color: var(--color-cta);
  font-weight: 600;
}
</style>