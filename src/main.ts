import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./config/router.ts";
import { createPinia } from 'pinia'
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/reset.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App)
const pinia = createPinia()
app.use(Antd)
app.use(pinia)
pinia.use(piniaPluginPersistedstate);
app.use(router)
app.mount('#app')
