<template>
  <div class="profile-container">
    <a-skeleton :loading="loading" active :avatar="{ size: 100 }" :paragraph="{ rows: 12 }">
      <a-watermark :content="userInfo.username || '精准之路'" :font="{ color: 'rgba(0,0,0,0.04)' }">
        
        <div class="profile-content">
          <div class="profile-header">
            <a-avatar :size="90" :src="userInfo.avatarUrl" class="apple-shadow">
              {{ userInfo.username?.charAt(0) }}
            </a-avatar>
            <div class="user-main-info">
              <div class="name-row">
                <h1>{{ userInfo.username || '未设置昵称' }}</h1>
                <a-tag color="black">PRO 会员</a-tag>
              </div>
              <p class="account-id">Account ID: {{ userInfo.userAccount }}</p>
            </div>
            <div class="header-actions">
              <a-button type="primary" shape="round" ghost @click="handleEdit">设置资料</a-button>
            </div>
          </div>

          <a-row :gutter="[20, 20]" class="asset-section">
            <a-col :xs="24" :sm="12" :md="8">
              <div class="asset-card balance">
                <span class="label">账户余额</span>
                <div class="value">
                  <span class="symbol">¥</span>
                  <span class="amount">12,850.00</span>
                </div>
                <a-button type="link" class="action-link">充值 ></a-button>
              </div>
            </a-col>
            <a-col :xs="24" :sm="12" :md="8">
              <div class="asset-card points">
                <span class="label">精准积分</span>
                <div class="value">
                  <span class="amount">4,260</span>
                </div>
                <a-button type="link" class="action-link">兑换礼品 ></a-button>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="8">
              <div class="asset-card coupon">
                <span class="label">优惠券</span>
                <div class="value">
                  <span class="amount">3</span><span class="unit">张可用</span>
                </div>
                <a-button type="link" class="action-link">领券中心 ></a-button>
              </div>
            </a-col>
          </a-row>

          <a-row :gutter="[20, 20]">
            <a-col :xs="24" :lg="16">
              <a-card title="详细档案" :bordered="false" class="apple-card">
                <a-descriptions :column="2">
                  <a-descriptions-item label="用户角色">
                    <a-badge status="success" :text="userInfo.userRole === 'admin' ? '首席管理员' : '高级会员'" />
                  </a-descriptions-item>
                  <a-descriptions-item label="性别">{{ userInfo.gender === 1 ? '男' : '女' }}</a-descriptions-item>
                  <a-descriptions-item label="电子邮箱">{{ userInfo.email || '未绑定' }}</a-descriptions-item>
                  <a-descriptions-item label="联系电话">{{ userInfo.phone || '未绑定' }}</a-descriptions-item>
                  <a-descriptions-item label="注册时间">{{ userInfo.createTime }}</a-descriptions-item>
                  <a-descriptions-item label="最后登录">{{ userInfo.updateTime }}</a-descriptions-item>
                </a-descriptions>
              </a-card>
            </a-col>

            <a-col :xs="24" :lg="8">
              <a-card title="默认收货地址" :bordered="false" class="apple-card">
                <template #extra><a href="#">管理地址</a></template>
                <div class="address-content">
                  <div class="address-user">
                    <strong>{{ userInfo.username }}</strong> 
                    <span class="tel">138****8000</span>
                  </div>
                  <p class="address-text">
                    上海市浦东新区张江高科技园区 核心路 1 号精准大厦 A 座 1201 室
                  </p>
                  <a-tag color="blue">默认</a-tag>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>

      </a-watermark>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getLoginUser } from '../api/sdk.gen';
import { useUserStore } from '../config/stores';
import type { LoginUserVo } from '../api/types.gen';

const userStore = useUserStore();
const userInfo = ref<LoginUserVo>({});
const loading = ref(true);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getLoginUser();
    if (res.data?.code === 0 && res.data.data) {
      userInfo.value = res.data.data;
      userStore.setLoginUser(res.data.data);
    }
  } catch (error) {
    message.error("无法加载用户信息");
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadData());

const handleEdit = () => message.info('正在进入安全设置...');
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 40px 0;
}

.profile-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-header {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}
.apple-shadow {
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.user-main-info h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.account-id { color: #86868b; font-size: 14px; margin: 4px 0 0; }

.asset-section { margin-bottom: 20px; }
.asset-card {
  padding: 24px;
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  height: 140px;
}
.asset-card .label { font-size: 14px; opacity: 0.8; }
.asset-card .value { margin-top: 10px; }
.asset-card .amount { font-size: 28px; font-weight: 600; }
.asset-card .symbol, .asset-card .unit { font-size: 16px; margin: 0 4px; }
.asset-card .action-link {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  opacity: 0.9;
}

.balance { background: linear-gradient(135deg, #1d1d1f 0%, #434343 100%); }
.points { background: linear-gradient(135deg, #0071e3 0%, #00b0ff 100%); }
.coupon { background: linear-gradient(135deg, #f56300 0%, #ff9f0a 100%); }

.apple-card {
  border-radius: 20px;
  height: 100%;
}
:deep(.ant-card-head) { border-bottom: none; padding: 24px 24px 0; font-size: 18px; font-weight: 600; }
:deep(.ant-card-body) { padding: 24px; }

.address-user { margin-bottom: 8px; font-size: 15px; }
.tel { color: #86868b; margin-left: 10px; }
.address-text { color: #1d1d1f; line-height: 1.6; font-size: 14px; margin-bottom: 12px; }

@media (max-width: 768px) {
  .profile-header { flex-direction: column; text-align: center; }
}
</style>