import { createApp } from 'vue'
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import './style.css'
import App from './App.vue'
import router from "./config/router";
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
pinia.use(piniaPluginPersistedstate);
app.use(router)
app.mount('#app')
