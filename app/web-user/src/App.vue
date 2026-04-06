<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './config/stores';
import { getLoginUser } from './api/userController';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const userStore = useUserStore();
const doInit = async () => {
  try {
    const res = await getLoginUser();
    if (res.code === 0 && res.data) {
      userStore.setLoginUser(res.data);
      return;
    }
    userStore.clearLoginUser();
  } catch (e) {
    userStore.clearLoginUser();
    console.log("Backend not available or error:", e);
  }
};

onMounted(() => {
  doInit();
});
</script>

<style>
#app {
  height: 100%;
}
</style>
