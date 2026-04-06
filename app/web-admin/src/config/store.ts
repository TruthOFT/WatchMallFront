import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import { getLoginUser, userLogout } from "@/api/userController";

const normalizeUserRole = (userRole?: string) => String(userRole ?? "").trim().toLowerCase();

export const useAlertsStore = defineStore("loginUser", () => {
  const loginUser = ref<API.LoginUserVO>({});

  const isLogin = computed(() => Boolean(loginUser.value?.id));
  const isAdmin = computed(() => normalizeUserRole(loginUser.value?.userRole) === "admin");

  const fetchLoginUser = async () => {
    try {
      const res = await getLoginUser();
      if (res.code === 0 && res.data?.id) {
        const currentUser = {
          ...res.data,
          userRole: normalizeUserRole(res.data.userRole),
        };
        loginUser.value = currentUser;
        return currentUser;
      }
    } catch (error) {
      console.error("fetch login user failed", error);
    }
    loginUser.value = {};
    return undefined;
  };

  const setLoginUser = (user: API.LoginUserVO | undefined) => {
    loginUser.value = user
      ? {
          ...user,
          userRole: normalizeUserRole(user.userRole),
        }
      : {};
  };

  const clearLoginUser = () => {
    loginUser.value = {};
  };

  const logout = async (silent = false) => {
    try {
      const res = await userLogout();
      if (!silent && res.code === 0) {
        message.success(res.message || "已退出登录");
      }
    } catch (error) {
      console.error("logout failed", error);
    } finally {
      clearLoginUser();
    }
  };

  return {
    loginUser,
    isLogin,
    isAdmin,
    normalizeUserRole,
    fetchLoginUser,
    setLoginUser,
    clearLoginUser,
    logout,
  };
});
