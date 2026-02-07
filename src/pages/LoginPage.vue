<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-container">
      <div class="glass-panel login-card liquid-glass">
        <div class="login-header">
          <h2>欢迎回来</h2>
          <p>登录您的私人账号</p>
        </div>
        
        <a-form
          :model="formState"
          name="basic"
          layout="vertical"
          autocomplete="off"
          @finish="onFinish"
        >
          <a-form-item
            label="账号"
            name="userAccount"
            :rules="[{ required: true, message: '请输入您的账号！' }]"
          >
            <a-input v-model:value="formState.userAccount" size="large" placeholder="请输入用户名/账号" />
          </a-form-item>

          <a-form-item
            label="密码"
            name="userPassword"
            :rules="[{ required: true, message: '请输入您的密码！' }]"
          >
            <a-input-password v-model:value="formState.userPassword" size="large" placeholder="请输入密码" />
          </a-form-item>

          <div class="form-actions">
            <a-checkbox v-model:checked="formState.rememberMe">记住我</a-checkbox>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>

          <a-form-item>
            <a-button type="primary" html-type="submit" block size="large" :loading="loading">
              登录
            </a-button>
          </a-form-item>
          
          <div class="register-link">
            还不是会员？ <a href="#">申请加入</a>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { userLogin } from '@/api/userController';
import { useUserStore } from '@/config/stores';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);

const formState = reactive({
  userAccount: '',
  userPassword: '',
  rememberMe: false
});

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    const res = await userLogin(formState);
    if (res.code === 0 && res.data) {
      message.success('欢迎回来，尊敬的会员。');
      userStore.setLoginUser(res.data);
      const redirectPath = (route.query.redirect as string) || '/';
      router.push(redirectPath);
    } else {
      message.error(res.message || '登录失败');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    message.error('登录过程中发生错误，请稍后重试。');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 120px 20px;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1559563458-527698bf5295?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover;
  z-index: -1;
}

.login-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(5px);
}

.login-container {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
}

.login-card {
  padding: 48px;
  background: rgba(255, 255, 255, 0.85);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h2 {
  margin-bottom: 8px;
  font-size: 2rem;
}

.login-header p {
  color: var(--color-secondary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: var(--color-primary);
  font-size: 0.9rem;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 0.9rem;
  color: var(--color-secondary);
}

.register-link a {
  color: var(--color-cta);
  font-weight: 600;
}
</style>
