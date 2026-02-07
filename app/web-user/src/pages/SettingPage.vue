<template>
  <div class="setting-page">
    <div class="container">
      <div class="page-header">
        <h1>账号设置</h1>
        <p>管理您的账号安全与个性化偏好。</p>
      </div>

      <div class="settings-layout liquid-glass">
        <a-tabs v-model:activeKey="activeTab" tab-position="left" class="settings-tabs">
          <a-tab-pane key="security">
            <template #tab>
              <span><lock-outlined /> 账号安全</span>
            </template>
            <div class="tab-content">
              <h3>账号安全</h3>
              <p class="tab-desc">管理您的密码与安全设置以保护账号。</p>
              
              <div class="setting-item">
                <div class="item-info">
                  <h4>登录密码</h4>
                  <p>建议定期更新密码以维护账号安全。</p>
                </div>
                <a-button @click="message.info('功能即将上线')">修改密码</a-button>
              </div>

              <div class="setting-item">
                <div class="item-info">
                  <h4>双重身份验证</h4>
                  <p>为您的账号添加额外一层安全保护。</p>
                </div>
                <a-switch />
              </div>

              <div class="setting-item">
                <div class="item-info">
                  <h4>最近登录活动</h4>
                  <p>监控您账号的登录时间与地点。</p>
                </div>
                <a-button type="link">查看记录</a-button>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="address">
            <template #tab>
              <span><environment-outlined /> 地址管理</span>
            </template>
            <div class="tab-content">
              <div class="header-with-action">
                <h3>收货地址</h3>
                <a-button type="primary" @click="message.info('添加地址功能即将上线')">
                  新增地址
                </a-button>
              </div>
              <p class="tab-desc">管理您的配送地址，以便快速完成结算。</p>

              <div class="address-list">
                <div v-for="addr in addresses" :key="addr.id" class="address-card">
                  <div class="addr-header">
                    <span class="addr-tag" v-if="addr.isDefault">默认地址</span>
                    <div class="addr-actions">
                      <a-button type="link" size="small">编辑</a-button>
                      <a-button type="link" size="small" danger>删除</a-button>
                    </div>
                  </div>
                  <div class="addr-body">
                    <p class="addr-name">{{ addr.name }} <span class="addr-phone">{{ addr.phone }}</span></p>
                    <p class="addr-detail">{{ addr.detail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="notification">
            <template #tab>
              <span><bell-outlined /> 通知设置</span>
            </template>
            <div class="tab-content">
              <h3>通知偏好</h3>
              <div class="setting-item">
                <div class="item-info">
                  <h4>独家优惠</h4>
                  <p>通过邮件接收新品上市及私人特卖信息。</p>
                </div>
                <a-switch checked />
              </div>
              <div class="setting-item">
                <div class="item-info">
                  <h4>订单动态</h4>
                  <p>接收关于订单状态及配送信息的通知。</p>
                </div>
                <a-switch checked />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  LockOutlined, 
  EnvironmentOutlined, 
  BellOutlined 
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const activeTab = ref('security');

const addresses = ref([
  {
    id: 1,
    name: '张先生',
    phone: '+86 138 0000 0000',
    detail: '北京市朝阳区建国门外大街1号 某某大厦 1201室',
    isDefault: true
  },
  {
    id: 2,
    name: '张先生',
    phone: '+86 138 0000 0000',
    detail: '上海市浦东新区陆家嘴环路1000号 某某金融中心 45楼',
    isDefault: false
  }
]);
</script>

<style scoped>
.setting-page {
  padding: 160px 0 100px;
  background-color: var(--color-bg-main);
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-secondary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.settings-layout {
  min-height: 600px;
  background: #fff;
}

.settings-tabs {
  height: 100%;
}

:deep(.ant-tabs-nav) {
  width: 250px;
  padding: 32px 0;
  border-right: 1px solid rgba(0,0,0,0.05);
}

:deep(.ant-tabs-tab) {
  padding: 16px 32px !important;
  font-size: 1rem !important;
  margin: 0 !important;
  transition: all 0.3s;
}

:deep(.ant-tabs-tab-active) {
  background: rgba(202, 138, 4, 0.05);
}

:deep(.ant-tabs-ink-bar) {
  background-color: var(--color-cta) !important;
}

.tab-content {
  padding: 40px 60px;
}

.tab-content h3 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.tab-desc {
  color: var(--color-text-muted);
  margin-bottom: 40px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.item-info p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.address-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.address-card {
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.address-card:hover {
  border-color: var(--color-cta);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.addr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.addr-tag {
  background: var(--color-primary);
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 8px;
  font-weight: 700;
  letter-spacing: 1px;
}

.addr-name {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.addr-phone {
  font-weight: 400;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-left: 8px;
}

.addr-detail {
  color: var(--color-secondary);
  line-height: 1.6;
}

@media (max-width: 900px) {
  :deep(.ant-tabs-nav) {
    width: 100%;
  }
}
</style>