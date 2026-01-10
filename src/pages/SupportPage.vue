<template>
  <div class="support-container">
    <div class="support-header">
      <h1>服务与支持</h1>
      <p>有什么可以帮到您的？我们随时为您提供技术支持与解决方案</p>
      <a-input-search
        placeholder="搜索常见问题或操作指南..."
        enter-button="搜索"
        size="large"
        class="search-bar"
        @search="onSearch"
      />
    </div>

    <div class="support-content">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="support-card">
            <template #cover>
              <div class="icon-wrapper"><BookOutlined /></div>
            </template>
            <a-card-meta title="使用文档" description="详细的产品操作手册" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="support-card">
            <template #cover>
              <div class="icon-wrapper"><CustomerServiceOutlined /></div>
            </template>
            <a-card-meta title="在线客服" description="即时解答您的疑问" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="support-card">
            <template #cover>
              <div class="icon-wrapper"><FileProtectOutlined /></div>
            </template>
            <a-card-meta title="售后保障" description="退换货及维修政策" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="support-card">
            <template #cover>
              <div class="icon-wrapper"><ThunderboltOutlined /></div>
            </template>
            <a-card-meta title="快速入门" description="3分钟上手精准之路" />
          </a-card>
        </a-col>
      </a-row>

      <div class="faq-section">
        <h2 class="section-title">常见问题 (FAQ)</h2>
        <a-collapse v-model:activeKey="activeKey" ghost>
          <a-collapse-panel key="1" header="如何找回登录密码？">
            <p>您可以在登录页面点击“忘记密码”，通过绑定的手机号或邮箱进行校验并重置。</p>
          </a-collapse-panel>
          <a-collapse-panel key="2" header="精准之路提供哪些技术服务？">
            <p>我们提供全天候的云端监控、自动化部署支持以及一对一的专家咨询服务。</p>
          </a-collapse-panel>
          <a-collapse-panel key="3" header="购买服务后如何申请发票？">
            <p>登录后台进入“个人中心 - 订单管理”，选择对应订单点击“申请开票”即可。</p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  BookOutlined,
  CustomerServiceOutlined,
  FileProtectOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue';

const activeKey = ref(['1']);
const onSearch = (value: string) => {
  console.log('用户搜索支持内容:', value);
};
</script>

<style scoped>
.support-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 50px;
}

.support-header {
  background: linear-gradient(135deg, #1890ff 0%, #001529 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.support-header h1 {
  color: white;
  font-size: 32px;
  margin-bottom: 16px;
}

.support-header p {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 30px;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
}

.support-content {
  max-width: 1200px;
  margin: -40px auto 0;
  padding: 0 20px;
}

.support-card {
  text-align: center;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  padding: 30px 0 10px;
  font-size: 40px;
  color: #1890ff;
}

.faq-section {
  margin-top: 60px;
  background: white;
  padding: 40px;
  border-radius: 8px;
}

.section-title {
  margin-bottom: 24px;
  padding-left: 12px;
  border-left: 4px solid #1890ff;
  font-size: 20px;
}
</style>