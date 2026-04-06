<template>
  <div class="login-page">
    <div class="ambient ambient-left"></div>
    <div class="ambient ambient-right"></div>

    <div class="login-shell">
      <section class="brand-panel">
        <p class="brand-eyebrow">watch mall admin</p>
        <h1 class="brand-title">统一管理商品、分类与属性</h1>
        <p class="brand-desc">
          使用管理员账号登录后即可进入后台。普通用户账号会被拦截，不能进入管理系统。
        </p>
      </section>

      <a-card class="login-card" :bordered="false">
        <template #title>
          <div class="card-header">
            <span class="card-title">管理员登录</span>
            <span class="card-subtitle">secure access only</span>
          </div>
        </template>

        <a-form :model="formState" layout="vertical" @finish="onFinish">
          <a-form-item
            name="userAccount"
            label="账号"
            :rules="[{ required: true, message: '请输入账号' }]"
          >
            <a-input v-model:value="formState.userAccount" placeholder="请输入管理员账号" size="large" />
          </a-form-item>

          <a-form-item
            name="userPassword"
            label="密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" size="large" />
          </a-form-item>

          <a-form-item name="rememberMe">
            <a-checkbox v-model:checked="formState.rememberMe">记住登录状态</a-checkbox>
          </a-form-item>

          <a-button type="primary" html-type="submit" block size="large" :loading="submitting" class="submit-button">
            登录后台
          </a-button>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { userLogin } from "@/api/userController";
import { useAlertsStore } from "@/config/store";

const router = useRouter();
const route = useRoute();
const userStore = useAlertsStore();
const submitting = ref(false);

const formState = reactive<API.UserLoginRequest>({
  userAccount: "",
  userPassword: "",
  rememberMe: true,
});

const onFinish = async () => {
  if (submitting.value) {
    return;
  }

  submitting.value = true;
  try {
    const res = await userLogin(formState);
    if (res.code !== 0 || !res.data) {
      message.error(res.message || "登录失败");
      return;
    }

    userStore.setLoginUser(res.data);
    const currentUser = (await userStore.fetchLoginUser()) ?? userStore.loginUser;
    const currentRole = userStore.normalizeUserRole(currentUser.userRole);

    if (currentRole !== "admin") {
      await userStore.logout(true);
      message.error(`当前账号无后台权限，当前角色：${currentRole || "空"}`);
      return;
    }

    userStore.setLoginUser(currentUser);
    message.success(res.message || "登录成功");
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/product/list";
    await router.replace(redirect);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap");

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: "Manrope", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 15% 18%, rgba(62, 173, 255, 0.2), transparent 32%),
    radial-gradient(circle at 85% 22%, rgba(255, 190, 92, 0.22), transparent 30%),
    linear-gradient(140deg, #f6f9fd 0%, #edf4fb 55%, #f9fbfe 100%);
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.42;
}

.ambient-left {
  width: 280px;
  height: 280px;
  top: -90px;
  left: -70px;
  background: #74cbff;
}

.ambient-right {
  width: 320px;
  height: 320px;
  right: -80px;
  bottom: -120px;
  background: #ffd18f;
}

.login-shell {
  width: min(980px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.brand-panel {
  border-radius: 28px;
  padding: 42px 38px;
  color: #f3f8ff;
  background: linear-gradient(135deg, rgba(12, 44, 77, 0.95) 0%, rgba(12, 86, 148, 0.9) 100%);
  box-shadow: 0 26px 60px rgba(16, 43, 74, 0.24);
}

.brand-eyebrow {
  margin: 0;
  color: #9fc7eb;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
}

.brand-title {
  margin: 16px 0 12px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.08;
  font-weight: 800;
}

.brand-desc {
  margin: 0;
  max-width: 520px;
  line-height: 1.8;
  color: #d0e4f7;
  font-size: 15px;
}

.login-card {
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 22px 54px rgba(18, 45, 74, 0.14);
}

.login-card :deep(.ant-card-head) {
  border-bottom: 0;
  padding: 24px 28px 0;
}

.login-card :deep(.ant-card-body) {
  padding: 12px 28px 28px;
}

.card-header {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 28px;
  font-weight: 800;
  color: #12293f;
}

.card-subtitle {
  font-size: 12px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #6a87a3;
}

.submit-button {
  height: 46px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(120deg, #0f66e8 0%, #29b2ff 100%);
  box-shadow: 0 12px 24px rgba(15, 102, 232, 0.24);
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
}
</style>
