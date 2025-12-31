import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from "./config/router.ts";
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/reset.css';
const app = createApp(App)
app.use(Antd)
app.use(router)
app.mount('#app')
