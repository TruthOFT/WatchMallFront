<template>
  <div class="forgot-page">
    <div class="forgot-bg"></div>
    <div class="forgot-container">
      <div class="glass-panel forgot-card liquid-glass">
        <div class="forgot-header">
          <h2>找回密码</h2>
          <p>输入账号和旧密码，验证通过后重置新密码。</p>
        </div>

        <a-form layout="vertical" :model="formState" autocomplete="off" @finish="handleSubmit">
          <a-form-item label="账号" name="userAccount" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input
              v-model:value="formState.userAccount"
              class="forgot-input"
              size="large"
              placeholder="请输入登录账号"
            />
          </a-form-item>

          <a-form-item label="旧密码" name="oldPassword" :rules="[{ required: true, message: '请输入旧密码' }]">
            <a-input-password
              v-model:value="formState.oldPassword"
              class="forgot-input"
              size="large"
              placeholder="请输入旧密码"
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
              class="forgot-input"
              size="large"
              placeholder="请输入新密码"
            />
          </a-form-item>

          <a-form-item label="确认新密码" name="checkPassword" :rules="[{ required: true, message: '请再次输入新密码' }]">
            <a-input-password
              v-model:value="formState.checkPassword"
              class="forgot-input"
              size="large"
              placeholder="请再次输入新密码"
            />
          </a-form-item>

          <div class="form-actions">
            <a-button class="action-btn" html-type="button" @click="goLogin">返回登录</a-button>
            <a-button class="action-btn" type="primary" html-type="submit" :loading="submitting">重置密码</a-button>
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
import { resetForgotPassword } from '@/api/userController';

const router = useRouter();
const submitting = ref(false);

const formState = reactive({
  userAccount: '',
  oldPassword: '',
  newPassword: '',
  checkPassword: '',
});

const goLogin = () => {
  void router.push('/user/login');
};

const handleSubmit = async () => {
  if (!formState.userAccount || !formState.oldPassword || !formState.newPassword || !formState.checkPassword) {
    message.error('请完整填写找回密码信息');
    return;
  }
  if (formState.oldPassword.length < 8) {
    message.error('旧密码错误');
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
    const res = await resetForgotPassword(formState);
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '密码重置失败');
      return;
    }
    message.success('密码重置成功，请重新登录');
    await router.push('/user/login');
  } catch (error) {
    console.error('Reset password error:', error);
    message.error('密码重置失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 120px 20px;
}

.forgot-bg {
  position: absolute;
  inset: 0;
  background: url("@/assets/bg.jpg") center/cover;
  z-index: -1;
}

.forgot-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(5px);
}

.forgot-container {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
}

.forgot-card {
  padding: 44px;
  background: rgba(255, 255, 255, 0.88);
}

.forgot-header {
  text-align: center;
  margin-bottom: 28px;
}

.forgot-header h2 {
  margin-bottom: 8px;
  font-size: 2rem;
}

.forgot-header p {
  color: var(--color-secondary);
  line-height: 1.7;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
}

.action-btn {
  min-width: 120px;
  height: 40px;
  border-radius: 0;
  font-weight: 600;
}

:deep(.forgot-input.ant-input),
:deep(.forgot-input.ant-input-affix-wrapper) {
  padding: 12px 16px;
  border-radius: 0;
  border: 1px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.forgot-input.ant-input:focus),
:deep(.forgot-input.ant-input-affix-wrapper:focus),
:deep(.forgot-input.ant-input-affix-wrapper-focused) {
  border-color: var(--color-cta);
  box-shadow: none;
}

:deep(.forgot-input.ant-input-affix-wrapper .ant-input) {
  padding: 0;
  background: transparent;
}

@media (max-width: 640px) {
  .forgot-card {
    padding: 28px 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
