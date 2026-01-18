<template>
  <a-row :wrap="false">
    <a-col :span="4">
      <div class="title-bar" @click="router.push('/')" style="cursor: pointer">
        <img class="logo" src="../assets/07-deer.svg" alt="logo"/>
        <div class="title">精准之路</div>
      </div>
    </a-col>
    <a-col :span="10">
      <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick"/>
    </a-col>
    <a-col :span="4">
      <a-input-search v-model:value="searchValue" placeholder="搜索..." @search="onSearch"
                      style="width: 180px; margin-top: 18px;"/>
    </a-col>
    <a-col :span="6">
      <div class="right-area">
        <div class="cart">
          <a-button type="link" @click="goCart">购物车</a-button>
        </div>
        <div class="login_status">
          <template v-if="userStore.isLogin">
            <a-dropdown-button>
              {{ userStore.loginUser.username }}
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="profile">
                    <UserOutlined/>
                    个人信息
                  </a-menu-item>
                  <a-menu-divider/>
                  <a-menu-item key="logout">
                    <LogoutOutlined/>
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
              <template #icon>
                <a-avatar size="small" :src="getFullAvatarUrl(userStore.loginUser.avatarUrl)">
                  {{ userStore.loginUser.username }}
                </a-avatar>
              </template>
            </a-dropdown-button>
          </template>
          <template v-else>
            <a-button type="primary" @click="goLogin">登录</a-button>
          </template>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import {h, ref, watchEffect} from "vue";
import {
  HomeOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined
} from "@ant-design/icons-vue";
import {message, type MenuProps} from "ant-design-vue";
import {useRouter, useRoute} from "vue-router";
import {useUserStore} from "@/config/stores";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const searchValue = ref<string>('');
const items = ref<MenuProps["items"]>([
  {key: "/index", icon: () => h(HomeOutlined), label: "首页"},
  {
    key: "category",
    label: "分类",
    icon: () => h(AppstoreOutlined),
    children: [
      {
        type: 'group',
        label: '机芯类型',
        children: [
          { label: '机械表', key: '/category/mechanical' },
          { label: '石英表', key: '/category/quartz' },
          { label: '电子 / 智能表', key: '/category/smart' },
        ],
      },
      {
        type: 'group',
        label: '适用人群',
        children: [
          { label: '男士腕表', key: '/category/men' },
          { label: '女士腕表', key: '/category/women' },
        ],
      },
      {
        type: 'group',
        label: '功能特点',
        children: [
          { label: '防水腕表', key: '/category/waterproof' },
          { label: '运动腕表', key: '/category/sport' },
          { label: '商务腕表', key: '/category/business' },
        ],
      },
      {
        type: 'group',
        label: '配件',
        children: [
          { label: '表带', key: '/category/band' },
          { label: '表盒', key: '/category/box' },
          { label: '其他配件', key: '/category/accessory' },
        ],
      },
    ],
  },

  { key: "/order", icon: () => h(ProfileOutlined), label: "我的订单" },
  {key: "/support", icon: () => h(ToolOutlined), label: "服务与支持"},
  {key: "/about", icon: () => h(InfoCircleOutlined), label: "关于"},
]);

const goCart = () => {
  router.push("/cart");
};

const goLogin = () => {
  router.push("/user/login");
};

const onSearch = (val: string) => {
  console.log("搜索内容:", val);
};

const doMenuClick = ({key}: { key: string }) => {
  if (key.startsWith('/')) {
    router.push(key);
  }
};

const current = ref<string[]>(['/index']);
watchEffect(() => {
  current.value = [route.path];
});
const handleMenuClick: MenuProps['onClick'] = ({key}) => {
  if (key === 'logout') {
    userStore.logout();
    message.success("已成功退出登录");
    router.push("/index");
  } else if (key === 'profile') {
    router.push("/user/profile");
  }
};
const BACKEND_HOST = "http://localhost:8080";

const getFullAvatarUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_HOST}${path}`;
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #1890ff;
  font-size: 18px;
  font-weight: bold;
  margin-left: 12px;
}

.logo {
  height: 40px;
}

.right-area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}
</style>