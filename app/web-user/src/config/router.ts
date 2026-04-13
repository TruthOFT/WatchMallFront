import { createRouter, createWebHashHistory } from 'vue-router'
import BasicLayout from "@/layouts/BasicLayout.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import SupportPage from "@/pages/SupportPage.vue";
import AboutPage from "@/pages/AboutPage.vue";
import CartPage from "@/pages/CartPage.vue";
import FaqPage from "@/pages/FaqPage.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import OrderPage from "@/pages/OrderPage.vue";
import FavoritePage from "@/pages/FavoritePage.vue";
import SettingPage from "@/pages/SettingPage.vue";
import ChangePasswordPage from "@/pages/ChangePasswordPage.vue";
import IndexPage from '@/pages/IndexPage.vue';
import ProductDetailPage from '@/pages/ProductDetailPage.vue';
import CategoryProductListPage from '@/pages/CategoryProductListPage.vue';
import SearchProductPage from '@/pages/SearchProductPage.vue';
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
                meta: { public: true },
            },
            {
                path: "product/:id",
                component: ProductDetailPage,
                meta: { public: true },
            },
            {
                path: "category/:categoryId",
                component: CategoryProductListPage,
                meta: { public: true },
            },
            {
                path: "search",
                component: SearchProductPage,
                meta: { public: true },
            },
            {
                path: "support",
                component: SupportPage,
                meta: { public: true },
            },
            {
                path: "about",
                component: AboutPage,
                meta: { public: true },
            },
            {
                path: "faq",
                component: FaqPage,
                meta: { public: true },
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
                component: LoginPage,
                meta: { public: true },
            },
            {
                path: "register",
                component: RegisterPage,
                meta: { public: true },
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
                path: "favorites",
                component: FavoritePage
            },
            {
                path: "cart",
                component: CartPage,
            },
            {
                path: "settings",
                component: SettingPage,
            },
            {
                path: "change-password",
                component: ChangePasswordPage,
            }
        ]
    },
    {
        path: "/settings",
        redirect: "/user/settings",
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        void to
        void from
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

router.beforeEach((to, from, next) => {
    void from
    const userStore = useUserStore()
    const isLogin = !!userStore.loginUser.id;

    if (to.matched.some((record) => record.meta?.public) || isLogin) {
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
