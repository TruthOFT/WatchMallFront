<template>
  <a-config-provider :locale="appLocale" :render-empty="renderEmpty">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { Empty } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

const emptyDescription = '暂无数据'

const appLocale = {
  ...zhCN,
  Empty: {
    ...zhCN.Empty,
    description: emptyDescription,
  },
}

const renderEmpty = () => h(Empty, { description: emptyDescription })
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
