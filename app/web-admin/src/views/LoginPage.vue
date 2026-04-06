<template>
  <div class="login-page">
    <div class="login-container fade-in-up">
      <div class="login-header">
        <div class="logo">PawConnect 🐾</div>
        <h2 class="welcome-text">Welcome Back!</h2>
        <p class="subtitle">Log in to continue your adoption journey.</p>
      </div>

      <a-form
        :model="formState"
        name="basic"
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="login-form"
      >
        <a-form-item
          label="Email Address"
          name="email"
          :rules="[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]"
        >
          <a-input v-model:value="formState.email" placeholder="you@example.com" size="large">
            <template #prefix>
               <span class="icon">📧</span>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="••••••••" size="large">
            <template #prefix>
              <span class="icon">🔒</span>
            </template>
          </a-input-password>
        </a-form-item>
        
        <div class="form-actions">
           <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
           <a class="forgot-password" href="#">Forgot password?</a>
        </div>

        <a-form-item>
          <a-button type="primary" html-type="submit" block size="large" shape="round" class="login-btn">
            Log In
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface FormState {
  email?: string;
  password?: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  email: '',
  password: '',
  remember: true,
});

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top right, #fff7ed, #fed7aa);
  padding: 20px;
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 480px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 1.5rem;
  color: #431407;
  margin-bottom: 5px;
}

.subtitle {
  color: #78350f;
}

.login-form :deep(.ant-form-item-label > label) {
    color: #4b5563;
    font-weight: 600;
}

.login-form :deep(.ant-input-affix-wrapper) {
    border-radius: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    border-color: #fed7aa;
}

.login-form :deep(.ant-input-affix-wrapper:hover),
.login-form :deep(.ant-input-affix-wrapper:focus),
.login-form :deep(.ant-input-affix-wrapper-focused) {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

.icon {
    margin-right: 8px;
    font-size: 1.1rem;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.forgot-password {
    color: var(--primary);
    font-weight: 600;
}

.login-btn {
    font-weight: 700;
    height: 48px;
    font-size: 1.1rem;
    box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
}
</style>
