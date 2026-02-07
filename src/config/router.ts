import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from "@/layouts/BasicLayout.vue";
import LoginPage from "@/pages/LoginPage.vue";
import SupportPage from "@/pages/SupportPage.vue";
import AboutPage from "@/pages/AboutPage.vue";
import CartPage from "@/pages/CartPage.vue";
import FaqPage from "@/pages/FaqPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import OrderPage from "@/pages/OrderPage.vue";
import SettingPage from "@/pages/SettingPage.vue";
import IndexPage from '@/pages/IndexPage.vue';
import { message } from "ant-design-vue"
import { useUserStore } from './stores';
const routes = [
    {
        path: "/",
        component: BasicLayout,
        children: [
            {
                path: "",
                component: IndexPage,
            },
            {
                path: "support",
                component: SupportPage,
            },
            {
                path: "about",
                component: AboutPage,
            },
            {
                path: "faq",
                component: FaqPage,
            }
        ]
    },
    {
        path: '/user',
        component: BasicLayout,
        redirect: "/user/profile",
        children: [
            {
                path: "login",
                component: LoginPage
            },
            {
                path: "profile",
                component: ProfilePage
            },
            {
                path: 'orders',
                component: OrderPage
            },
            {
                path: "cart",
                component: CartPage,
            },
            {
                path: "settings",
                component: SettingPage,
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

const whiteList = ["/", "/user/login", "/user/register", "/support", "/about", "/faq"]

router.beforeEach((to, from, next) => {
    // For this demo, we'll be lenient with auth to show the pages.
    // In a real app, you'd check auth for cart checkout or profile pages.

    // Original Auth Logic preserved but commented out for demo purposes to ensure UI is visible without backend:
    const userStore = useUserStore()
    const isLogin = !!userStore.loginUser.id;
    console.log(to.path);
    
    if (to.path.startsWith('/user/login') || whiteList.includes(to.path) || isLogin) {
        next()
    } else {
        message.error("Please login first")
        next({
            path: "/user/login", // Redirect to our new login path if needed, or keep /user/login if backend expects it
            query: { redirect: to.fullPath },
        })
    }
})

export default router
