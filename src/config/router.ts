import {createRouter, createWebHashHistory} from 'vue-router'
import AboutPage from "@/pages/AboutPage.vue";
import CartPage from "@/pages/CartPage.vue";
import BasicLayout from "@/layouts/BasicLayout.vue";
import IndexPage from "@/pages/IndexPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import SupportPage from "@/pages/SupportPage.vue";
import UserProfilePage from '@/pages/UserProfilePage.vue';
import {useUserStore} from "./stores.ts";
import {message} from "ant-design-vue";

const routes = [
    {
        path: "/", component: BasicLayout, redirect: "/index", children: [
            {
                path: "index",
                component: IndexPage,
            },
            {path: 'about', component: AboutPage},
            {path: 'cart', component: CartPage},
            {path: 'support', component: SupportPage},
            {
                path: "/user/profile",
                component: UserProfilePage
            }
        ]
    },
    {
        path: "/user/login",
        component: LoginPage,
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
const whiteList = ["/index", "/user/login", "/user/register", "/support", "/about"]
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const isLogin = !!userStore.isLogin;
    if (isLogin || whiteList.includes(to.path)) {
        next()
    } else {
        message.error("未登录")
        next({
            path: "/user/login",
            query: { redirect: to.fullPath },
        })
    }
})

export default router