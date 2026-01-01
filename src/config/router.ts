import {createRouter, createWebHashHistory} from 'vue-router'
import AboutPage from "@/pages/AboutPage.vue";
import CartPage from "@/pages/CartPage.vue";
import BasicLayout from "@/layouts/BasicLayout.vue";
import IndexPage from "@/pages/IndexPage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import SupportPage from "@/pages/SupportPage.vue";
import UserProfilePage from '@/pages/UserProfilePage.vue';

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
        ]
    },
    {
        path: "/user/login",
        component: LoginPage,
    },
    {
        path: "/user/profile",
        component: UserProfilePage
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router