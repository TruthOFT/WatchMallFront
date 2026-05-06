<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1>会员中心</h1>
        <p>您的专属账号详情与偏好设置。</p>
      </div>

      <div class="profile-grid">
        <a-skeleton :loading="loading" active :avatar="{ size: 120 }">
          <div class="profile-card liquid-glass">
            <div class="profile-main">
              <div class="avatar-section">
                <a-upload
                  :show-upload-list="false"
                  accept="image/*"
                  :before-upload="handleAvatarUpload"
                  :disabled="avatarUploading"
                >
                  <a-avatar :src="avatarUrl" :size="120" class="profile-avatar">
                    <template #icon><user-outlined /></template>
                  </a-avatar>
                </a-upload>
                <div class="avatar-actions">
                  <a-upload
                    :show-upload-list="false"
                    accept="image/*"
                    :before-upload="handleAvatarUpload"
                    :disabled="avatarUploading"
                  >
                  <a-button type="link">更换头像</a-button>
                  </a-upload>
                </div>
              </div>
              
              <div class="profile-header-info">
                <h2 class="username">{{ userStore.loginUser.username || '尊贵会员' }}</h2>
                <div class="tier-badge">
                  <span class="member-tier text-gradient-gold">
                    {{ formatRole(userStore.loginUser.userRole) }}
                  </span>
                </div>
                <p class="since">加入时间：{{ formatDate(userStore.loginUser.createTime) }}</p>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-group">
                <h3>基本信息</h3>
                <div class="detail-row">
                  <span class="label">会员账号</span>
                  <span class="value">{{ userStore.loginUser.userAccount }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">电子邮箱</span>
                  <span class="value">{{ userStore.loginUser.email || '未绑定' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">联系电话</span>
                  <span class="value">{{ userStore.loginUser.phone || '未绑定' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">性别</span>
                  <span class="value">{{ formatGender(userStore.loginUser.gender) }}</span>
                </div>
              </div>

              <div class="detail-group">
                <h3>财务资产</h3>
                <div class="detail-row">
                  <span class="label">账户余额</span>
                  <span class="value balance">{{ formatCurrency(userStore.loginUser.balance || 0) }}</span>
                </div>
                <a-button type="primary" class="topup-btn">立即充值</a-button>
              </div>
            </div>
            
            <div class="profile-footer">
              <a-button type="primary" @click="handleEdit">编辑个人资料</a-button>
            </div>
          </div>
        </a-skeleton>
      </div>
    </div>

    <a-modal
      v-model:open="editModalOpen"
      title="编辑个人资料"
      :confirm-loading="profileSubmitting"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleProfileSubmit"
    >
      <a-form layout="vertical" class="profile-edit-form">
        <a-form-item label="昵称">
          <a-input v-model:value="profileForm.username" placeholder="请输入昵称" :maxlength="30" />
        </a-form-item>
        <a-form-item label="电子邮箱">
          <a-input v-model:value="profileForm.email" placeholder="请输入电子邮箱" :maxlength="80" />
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="profileForm.phone" placeholder="请输入联系电话" :maxlength="20" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="profileForm.gender" placeholder="请选择性别" allow-clear>
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="0">女</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { useUserStore } from '@/config/stores';
import { getLoginUser, updateMyUser, uploadAvatar } from '@/api/userController';
import { BASE_URL } from '@/request';
import { UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';

const userStore = useUserStore();
const loading = ref(true);
const avatarUploading = ref(false);
const editModalOpen = ref(false);
const profileSubmitting = ref(false);
const profileForm = reactive({
  username: '',
  email: '',
  phone: '',
  gender: undefined as number | undefined,
});

const avatarUrl = computed(() => {
  const url = userStore.loginUser.avatarUrl;
  if (!url) {
    return '';
  }
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return `${BASE_URL}${url}`;
});

const handleAvatarUpload: UploadProps['beforeUpload'] = async (file) => {
  if (!file.type.startsWith('image/')) {
    message.error('请上传图片文件');
    return false;
  }
  if (file.size / 1024 / 1024 > 5) {
    message.error('头像大小不能超过 5MB');
    return false;
  }

  avatarUploading.value = true;
  try {
    const res = await uploadAvatar(file as File);
    if (res.code === 0 && res.data) {
      userStore.setLoginUser({
        ...userStore.loginUser,
        avatarUrl: res.data,
      });
      message.success('头像更新成功');
    } else {
      message.error(res.message || '头像上传失败');
    }
  } catch (error) {
    console.error('Upload avatar error:', error);
    message.error('头像上传失败');
  } finally {
    avatarUploading.value = false;
  }

  return false;
};
const fetchUserInfo = async () => {
  loading.value = true;
  try {
    const res = await getLoginUser();
    if (res.code === 0 && res.data) {
      userStore.setLoginUser(res.data);
    } else {
      message.error(res.message || '获取用户信息失败');
    }
  } catch (error) {
    console.error('Fetch user info error:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '2026年';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const formatGender = (gender?: number) => {
  if (gender === 1) return '男';
  if (gender === 0) return '女'; // 假设 0 为女，1 为男
  return '保密';
};

const formatRole = (role?: number) => {
  if (role === 1) return '平台管理员 ADMIN';
  return '高级会员 PREMIUM MEMBER';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(value);
};

const handleEdit = () => {
  profileForm.username = userStore.loginUser.username || '';
  profileForm.email = userStore.loginUser.email || '';
  profileForm.phone = userStore.loginUser.phone || '';
  profileForm.gender = userStore.loginUser.gender;
  editModalOpen.value = true;
};

const handleProfileSubmit = async () => {
  const email = profileForm.email.trim();
  const phone = profileForm.phone.trim();

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    message.error('邮箱格式不正确');
    return;
  }
  if (phone && !/^[0-9+\-\s]{6,20}$/.test(phone)) {
    message.error('手机号格式不正确');
    return;
  }

  profileSubmitting.value = true;
  try {
    const res = await updateMyUser({
      username: profileForm.username.trim(),
      email,
      phone,
      gender: profileForm.gender,
    });

    if (res.code === 0 && res.data) {
      userStore.setLoginUser({
        ...userStore.loginUser,
        username: profileForm.username.trim(),
        email,
        phone,
        gender: profileForm.gender,
      });
      editModalOpen.value = false;
      message.success('个人资料更新成功');
      await fetchUserInfo();
    } else {
      message.error(res.message || '个人资料更新失败');
    }
  } catch (error) {
    console.error('Update profile error:', error);
    message.error('个人资料更新失败');
  } finally {
    profileSubmitting.value = false;
  }
};
</script>

<style scoped>
.profile-page {
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
  font-size: 3rem;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-secondary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.profile-card {
  padding: 60px;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.avatar-section {
  text-align: center;
}

.avatar-actions {
  margin-top: 12px;
}

.profile-header-info h2 {
  font-size: 2.5rem;
  margin-bottom: 4px;
}

.tier-badge {
  margin-bottom: 12px;
}

.member-tier {
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.since {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.detail-group {
  margin-bottom: 40px;
}

.detail-group h3 {
  font-size: 1.25rem;
  margin-bottom: 24px;
  border-left: 3px solid var(--color-cta);
  padding-left: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.label {
  color: var(--color-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.value {
  font-weight: 500;
  color: var(--color-primary);
}

.balance {
  font-family: var(--font-body);
  font-weight: 700;
  color: var(--color-cta);
  font-size: 1.2rem;
}

.topup-btn {
  margin-top: 16px;
}

.profile-footer {
  margin-top: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-main {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-card {
    padding: 30px 24px;
  }
}
</style>
