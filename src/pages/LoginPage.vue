<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header">
        <img class="logo" src="../assets/07-deer.svg" alt="logo"/>
        <h1 class="title">精准之路</h1>
        <p class="desc">欢迎回来，请登录您的账号</p>
      </div>

      <a-form
          :model="formState"
          name="login_form"
          layout="vertical"
          @finish="onFinish"
      >
        <a-form-item
            label="账号"
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号!' }]"
        >
          <a-input v-model:value="formState.userAccount" placeholder="请输入账号">
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            label="密码"
            name="userPassword"
            :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)"/>
            </template>
          </a-input-password>
        </a-form-item>

        <div class="extra-options">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
          <a-button type="link" size="small">忘记密码？</a-button>
        </div>

        <a-form-item>
          <a-button
              type="primary"
              html-type="submit"
              class="login-button"
              :loading="loading"
              block
          >
            登 录
          </a-button>
        </a-form-item>

        <div class="footer">
          还没有账号？
          <a-button type="link" style="padding: 0">立即注册</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import {useRoute, useRouter} from 'vue-router';
import {userLogin} from '@/api/userController'; // 你的 SDK 路径
import {useUserStore} from '@/config/stores';

const router = useRouter();
const route = useRoute()
const userStore = useUserStore();
const loading = ref(false);

// 表单数据定义
const formState = reactive({
  userAccount: '',
  userPassword: '',
});

const onFinish = async (values: any) => {
  loading.value = true;
  console.log(values);
  try {
    const res = await userLogin({
          userAccount: values.userAccount,
          userPassword: values.userPassword,
        },
    );

    if (res.data?.code === 0) {
      message.success('登录成功');
      userStore.loginUser = res.data.data;
      userStore.isLogin = true;
      const redirectPath = route.query.redirect as string || "/"
      await router.push(redirectPath);
    } else {
      message.error(res.data?.message || '登录失败');
    }
  } catch (error) {
    console.error('Login Error:', error)
    message.error('网络错误，请稍后再试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-image: url('/bg.png');
  background-size: cover;
  background-position: center;
}

/* 登录卡片 */
.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px); /* 背景磨砂效果 */
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  height: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 600;
  margin-bottom: 8px;
}

.desc {
  color: #8c8c8c;
  font-size: 14px;
}

.extra-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-button {
  height: 40px;
  font-size: 16px;
}

.footer {
  text-align: center;
  margin-top: 16px;
  color: #595959;
}
</style>