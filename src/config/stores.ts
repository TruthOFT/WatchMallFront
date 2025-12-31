import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 登录用户信息
  const loginUser = ref({
    username: '',
    userAvatar: '',
  });
  
  // 登录状态
  const isLogin = ref(false);

  // 模拟登录方法
  const setLoginUser = (user: { username: string; userAvatar: string }) => {
    loginUser.value = user;
    isLogin.value = true;
  };

  // 模拟退出方法
  const logout = () => {
    loginUser.value = { username: '', userAvatar: '' };
    isLogin.value = false;
  };

  return {
    loginUser,
    isLogin,
    setLoginUser,
    logout
  };
});