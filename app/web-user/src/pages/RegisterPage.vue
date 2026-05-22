<template>
  <div class="register-page">
    <div class="register-bg"></div>
    <div class="register-container">
      <div class="glass-panel register-card liquid-glass">
        <div class="register-header">
          <h2>加入会员</h2>
          <p>创建您的手环手表商城专属账号</p>
        </div>

        <a-form
          :model="formState"
          name="register"
          layout="vertical"
          autocomplete="off"
          @finish="onFinish"
        >
          <a-form-item
            label="账号"
            name="userAccount"
            :rules="[
              { required: true, message: '请输入账号' },
              { min: 4, message: '账号至少 4 位' }
            ]"
          >
            <a-input
              v-model:value="formState.userAccount"
              class="register-input"
              size="large"
              placeholder="请输入用户名/账号"
            />
          </a-form-item>

          <a-form-item
            label="密码"
            name="userPassword"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码至少 8 位' }
            ]"
          >
            <a-input-password
              v-model:value="formState.userPassword"
              class="register-input"
              size="large"
              placeholder="请输入密码"
            />
          </a-form-item>

          <a-form-item
            label="确认密码"
            name="checkPassword"
            :rules="[{ required: true, message: '请再次输入密码' }]"
          >
            <a-input-password
              v-model:value="formState.checkPassword"
              class="register-input"
              size="large"
              placeholder="请再次输入密码"
            />
          </a-form-item>

          <a-form-item name="agreeTerms" :rules="[{ validator: validateAgreement }]">
            <a-checkbox v-model:checked="formState.agreeTerms">
              我已阅读并同意服务条款与隐私政策
            </a-checkbox>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block size="large" :loading="loading">
              立即注册
            </a-button>
          </a-form-item>

          <div class="switch-link">
            已有账号？ <router-link to="/user/login">去登录</router-link>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { userRegister } from '@/api/userController';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
  agreeTerms: false
});

const validateAgreement = async (_rule: unknown, value: boolean) => {
  if (!value) {
    return Promise.reject(new Error('请先同意服务条款'));
  }
  return Promise.resolve();
};

const onFinish = async () => {
  if (formState.userPassword !== formState.checkPassword) {
    message.error('两次输入的密码不一致');
    return;
  }

  loading.value = true;
  try {
    const res = await userRegister({
      userAccount: formState.userAccount,
      userPassword: formState.userPassword,
      checkPassword: formState.checkPassword
    });

    if (res.code === 0) {
      message.success('注册成功，请登录');
      router.push('/user/login');
    } else {
      message.error(res.message || '注册失败，请稍后重试');
    }
  } catch (error) {
    console.error('Register error:', error);
    message.error('注册过程中发生错误，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 120px 20px;
}

.register-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("@/assets/register_bg.jpg") center/cover;
  z-index: -1;
}

.register-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

.register-container {
  width: 100%;
  max-width: 460px;
  position: relative;
  z-index: 1;
}

.register-card {
  padding: 48px;
  background: rgba(255, 255, 255, 0.85);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h2 {
  margin-bottom: 8px;
  font-size: 2rem;
}

.register-header p {
  color: var(--color-secondary);
}

.switch-link {
  text-align: center;
  margin-top: 16px;
  font-size: 0.9rem;
  color: var(--color-secondary);
}

.switch-link a {
  color: var(--color-cta);
  font-weight: 600;
}

:deep(.register-input.ant-input),
:deep(.register-input.ant-input-affix-wrapper) {
  padding: 12px 16px;
  border-radius: 0;
  border: 1px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.8);
}

:deep(.register-input.ant-input:focus),
:deep(.register-input.ant-input-affix-wrapper:focus),
:deep(.register-input.ant-input-affix-wrapper-focused) {
  border-color: var(--color-cta);
  box-shadow: none;
}

:deep(.register-input.ant-input-affix-wrapper .ant-input) {
  padding: 0;
  background: transparent;
}
</style>
