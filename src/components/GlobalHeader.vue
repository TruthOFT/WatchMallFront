<template>
  <a-row :wrap="false">
    <a-col :span="3">
      <div class="title-bar">
        <img class="logo" src="../assets/07-deer.svg" alt="logo"/>
        <div class="title">精准之路</div>
      </div>
    </a-col>
    <a-col :span="14">
      <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
      />
    </a-col>
    <a-col :span="4">
      <a-input-search
          v-model:value="value"
          placeholder="搜索..."
          @search="onSearch"
          style="margin-top: 15px; width: 200px"
      />
    </a-col>
    <a-col :span="1">
      <div class="login_status">
        <a-button type="link" @click="goLogin">登录</a-button>
      </div>
    </a-col>
    <a-col :span="3">
      <div class="cart">
        <a-button type="link" @click="goCart">购物车</a-button>
      </div>
    </a-col>
  </a-row>

</template>

<script lang="ts" setup>
import {h, ref} from "vue";
import {HomeOutlined, AppstoreOutlined, InfoCircleOutlined, ToolOutlined} from "@ant-design/icons-vue";
import type {MenuProps} from "ant-design-vue";
import {useRouter} from "vue-router";

const value = ref<string>('');

const items = ref<MenuProps["items"]>([
  {
    key: "/index",
    icon: () => h(HomeOutlined),
    label: "首页",
    title: "首页",
  },
  {
    key: "category",
    label: "分类",
    title: "分类",
    icon: () => h(AppstoreOutlined),
    children: [
      {
        type: 'group',
        label: '分类1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: '分类2',
      },
    ],
  },
  {
    key: "/support",
    icon: () => h(ToolOutlined),
    label: "服务与支持",
    title: "服务与支持",
  },
  {
    key: "/about",
    icon: () => h(InfoCircleOutlined),
    label: "关于",
    title: "关于",
  },
]);
const router = useRouter();

// 路由跳转事件
const doMenuClick = ({key}: { key: string }) => {
  router.push({
    path: key,
  });
};
const goCart = () => {
  router.push({
    path: "/cart",
  })
}
const goLogin = () => {
  router.push({
    path: "/user/login",
  })
}
// 当前选中菜单
const current = ref<string[]>(['/index']);
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path];
});


</script>

<style scoped>

.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
