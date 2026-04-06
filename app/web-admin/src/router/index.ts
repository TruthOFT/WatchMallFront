import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { message } from "ant-design-vue";
import { useAlertsStore } from "@/config/store";
import BasicLayout from "@/layouts/BasicLayout.vue";
import Login from "@/views/Login.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      public: true,
    },
  },
  {
    path: "/",
    component: BasicLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/Index.vue"),
      },
      {
        path: "user/list",
        name: "UserList",
        component: () => import("@/views/user/List.vue"),
      },
      {
        path: "pay/list",
        name: "PayList",
        component: () => import("@/views/pay/List.vue"),
      },
      {
        path: "order/list",
        name: "OrderList",
        component: () => import("@/views/order/List.vue"),
      },
      {
        path: "category",
        name: "Category",
        component: () => import("@/views/category/Index.vue"),
      },
      {
        path: "product/list",
        name: "ProductList",
        component: () => import("@/views/product/List.vue"),
      },
      {
        path: "product/new",
        name: "ProductCreate",
        component: () => import("@/views/product/Index.vue"),
      },
      {
        path: "product/:id/edit",
        name: "ProductEdit",
        component: () => import("@/views/product/Index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const userStore = useAlertsStore();
  const isPublic = Boolean(to.meta.public);

  if (!userStore.isLogin) {
    await userStore.fetchLoginUser();
  }

  if (to.path === "/login" && userStore.isLogin && userStore.isAdmin) {
    const redirect =
      typeof to.query.redirect === "string"
        ? to.query.redirect
        : "/dashboard";
    return redirect;
  }

  if (isPublic) {
    return true;
  }

  if (!userStore.isLogin) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (!userStore.isAdmin) {
    const currentUser = await userStore.fetchLoginUser();
    if (currentUser && userStore.isAdmin) {
      return true;
    }
    const currentRole = userStore.normalizeUserRole(
      currentUser?.userRole ?? userStore.loginUser.userRole
    );
    await message.error(`当前账号无后台权限，当前角色：${currentRole || "未知"}`);
    await userStore.logout(true);
    return {
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    };
  }

  return true;
});

export default router;
