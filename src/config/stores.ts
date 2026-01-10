import {defineStore} from "pinia";
import {ref} from "vue";
import type {LoginUserVo} from "@/api/typings";
import {userLogout} from "@/api/userController";

export const useUserStore = defineStore(
    "user",
    () => {
        const loginUser = ref<LoginUserVo>({});
        const isLogin = ref(false);

        const setLoginUser = (user: LoginUserVo) => {
            loginUser.value = user;
            isLogin.value = true;
        };

        const logout = async () => {
            try {
                await userLogout();
            } catch (error) {
                console.error("后端退出失败", error);
            } finally {
                loginUser.value = {};
                isLogin.value = false;
                localStorage.removeItem("user-storage");
            }
        };

        return {loginUser, isLogin, setLoginUser, logout};
    },
    {
        persist: {
            key: "user-storage",
            storage: localStorage,
        },
    }
);
