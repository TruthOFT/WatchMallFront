<template>
  <div class="change-password-page">
    <div class="change-password-bg"></div>
    <div class="change-password-container">
      <div class="glass-panel change-password-card liquid-glass">
        <div class="page-header">
          <h2>修改密码</h2>
          <p>为了您的账户安全，修改成功后需要重新登录。</p>
        </div>

        <a-form
          layout="vertical"
          :model="formState"
          @finish="handleSubmit"
        >
          <a-form-item
            label="当前密码"
            name="oldPassword"
            :rules="[{ required: true, message: '请输入当前密码' }]"
          >
            <a-input-password
              v-model:value="formState.oldPassword"
              class="form-input"
              size="large"
              placeholder="请输入当前密码"
            />
          </a-form-item>

          <a-form-item
            label="新密码"
            name="newPassword"
            :rules="[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '新密码长度不能少于 8 位' }
            ]"
          >
            <a-input-password
              v-model:value="formState.newPassword"
              class="form-input"
              size="large"
              placeholder="请输入新密码"
            />
          </a-form-item>

          <a-form-item
            label="确认新密码"
            name="checkPassword"
            :rules="[{ required: true, message: '请再次输入新密码' }]"
          >
            <a-input-password
              v-model:value="formState.checkPassword"
              class="form-input"
              size="large"
              placeholder="请再次输入新密码"
            />
          </a-form-item>

          <div class="form-actions">
            <a-button type="primary" @click="goBack">返回设置</a-button>
            <a-button type="primary" html-type="submit" :loading="submitting">
              确认修改
            </a-button>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { updateUserPassword } from '@/api/userController';
import { useUserStore } from '@/config/stores';

const router = useRouter();
const userStore = useUserStore();
const submitting = ref(false);

const formState = reactive({
  oldPassword: '',
  newPassword: '',
  checkPassword: '',
});

const goBack = () => {
  void router.push('/user/settings');
};

const handleSubmit = async () => {
  if (!formState.oldPassword || !formState.newPassword || !formState.checkPassword) {
    message.error('请完整填写密码信息');
    return;
  }
  if (formState.newPassword.length < 8) {
    message.error('新密码长度不能少于 8 位');
    return;
  }
  if (formState.oldPassword === formState.newPassword) {
    message.error('新密码不能与旧密码相同');
    return;
  }
  if (formState.newPassword !== formState.checkPassword) {
    message.error('两次输入的新密码不一致');
    return;
  }

  submitting.value = true;
  try {
    const res = await updateUserPassword(formState);
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '密码修改失败');
      return;
    }
    userStore.clearLoginUser();
    message.success('密码修改成功，请重新登录');
    await router.push('/user/login');
  } catch (error) {
    console.error('Update password error:', error);
    message.error('密码修改失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.change-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 140px 20px 80px;
}

.change-password-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, rgba(202, 138, 4, 0.2), transparent 35%),
    linear-gradient(135deg, rgba(24, 24, 27, 0.92), rgba(68, 64, 60, 0.78)),
    url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1600&q=80') center/cover;
  z-index: -1;
}

.change-password-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.46);
  backdrop-filter: blur(8px);
}

.change-password-container {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 1;
}

.change-password-card {
  padding: 40px;
  background: rgba(255, 255, 255, 0.88);
}

.page-header {
  text-align: center;
  margin-bottom: 28px;
}

.page-header h2 {
  margin-bottom: 8px;
  font-size: 2rem;
}

.page-header p {
  color: var(--color-secondary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
}

.form-actions .ant-btn {
  min-width: 120px;
}

:deep(.form-input.ant-input-affix-wrapper) {
  padding: 12px 16px;
  border-radius: 0;
  border: 1px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.form-input.ant-input-affix-wrapper:focus),
:deep(.form-input.ant-input-affix-wrapper-focused) {
  border-color: var(--color-cta);
  box-shadow: none;
}

:deep(.form-input.ant-input-affix-wrapper .ant-input) {
  padding: 0;
  background: transparent;
}

@media (max-width: 640px) {
  .change-password-card {
    padding: 28px 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .ant-btn {
    width: 100%;
  }
}
</style>
