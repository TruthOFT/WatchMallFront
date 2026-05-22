<template>
  <a-layout class="layout-shell">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      width="240"
      theme="light"
      class="layout-sider"
    >
      <div class="brand-block">
        <div class="brand-mark">表</div>
        <div v-if="!collapsed" class="brand-copy">
          <strong>手环手表商城</strong>
          <span>后台管理</span>
        </div>
      </div>

      <a-menu mode="inline" :selected-keys="selectedKeys" class="nav-menu">
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <router-link :to="item.path">{{ item.label }}</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-trigger" @click="collapsed = !collapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </div>

        <div class="header-right">
          <div class="user-summary">
            <span class="user-role">admin</span>
            <strong>{{ userName }}</strong>
          </div>
          <a-dropdown>
            <a-button>
              <template #icon>
                <UserOutlined />
              </template>
              操作
            </a-button>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="logout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { MenuProps } from "ant-design-vue";
import {
  AppstoreOutlined,
  BarsOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PayCircleOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  TeamOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { useAlertsStore } from "@/config/store";

const route = useRoute();
const router = useRouter();
const userStore = useAlertsStore();
const collapsed = ref(false);

const menuItems = [
  { key: "/dashboard", path: "/dashboard", label: "后台首页", icon: DashboardOutlined },
  { key: "/user/list", path: "/user/list", label: "用户管理", icon: TeamOutlined },
  { key: "/pay/list", path: "/pay/list", label: "支付记录", icon: PayCircleOutlined },
  { key: "/order/list", path: "/order/list", label: "订单管理", icon: ProfileOutlined },
  { key: "/support/list", path: "/support/list", label: "客户支持", icon: MessageOutlined },
  { key: "/product/list", path: "/product/list", label: "商品列表", icon: ShoppingOutlined },
  { key: "/product/new", path: "/product/new", label: "新增商品", icon: BarsOutlined },
  { key: "/category", path: "/category", label: "分类管理", icon: AppstoreOutlined },
];

const selectedKeys = computed(() => {
  if (route.path.startsWith("/product/") && route.path.endsWith("/edit")) {
    return ["/product/list"];
  }
  if (route.path.startsWith("/product/new")) {
    return ["/product/new"];
  }
  return [menuItems.find((item) => route.path.startsWith(item.path))?.key ?? "/dashboard"];
});

const userName = computed(
  () => userStore.loginUser.username || userStore.loginUser.userAccount || "管理员"
);

const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
  if (key !== "logout") {
    return;
  }
  await userStore.logout();
  await router.replace("/login");
};
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(68, 163, 255, 0.12), transparent 28%),
    radial-gradient(circle at top right, rgba(255, 188, 92, 0.18), transparent 26%),
    #f5f8fc;
}

.layout-sider {
  border-right: 1px solid rgba(190, 204, 219, 0.55);
  box-shadow: 10px 0 28px rgba(20, 44, 74, 0.06);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 18px 14px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f5bd8 0%, #1ea7ff 100%);
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand-copy {
  display: flex;
  flex-direction: column;
}

.brand-copy strong {
  color: #13263c;
  font-size: 16px;
}

.brand-copy span {
  color: #64809c;
  font-size: 12px;
}

.nav-menu {
  border-inline-end: 0;
  background: transparent;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(190, 204, 219, 0.5);
}

.header-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  color: #16324d;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #6d85a0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.layout-content {
  padding: 24px;
}

@media (max-width: 768px) {
  .layout-content {
    padding: 14px;
  }

  .user-summary {
    display: none;
  }
}
</style>
