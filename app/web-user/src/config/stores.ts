// src/config/stores/user.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userLogout } from "@/api/userController";

export const useUserStore = defineStore(
    "user",
    () => {
        const loginUser = ref<API.LoginUserVO>({});
        const isLogin = computed(() => !!loginUser.value?.id || !!loginUser.value?.username);

        const setLoginUser = (user: API.LoginUserVO) => {
            loginUser.value = user ?? {};
        };

        const clearLoginUser = () => {
            loginUser.value = {};
        };

        const logout = async () => {
            try {
                await userLogout();
            } catch (error) {
                console.error("后端退出失败", error);
            } finally {
                clearLoginUser();
                // ✅ 不建议手动 removeItem，让 persist 插件自己同步
                // 如果你就是想强制清掉持久化，再开这一行：
                // localStorage.removeItem("user-storage");
            }
        };

        return { loginUser, isLogin, setLoginUser, clearLoginUser, logout };
    },
    {
        persist: {
            key: "user-storage",
            storage: localStorage,
            // ✅ 建议只持久化必要字段
            paths: ["loginUser"],
        },
    }
);
