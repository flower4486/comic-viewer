import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import './style.css';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

let pinia = createPinia();
pinia.use(piniaPersist);
createApp(App).use(pinia).use(ElementPlus).use(router).mount('#app');
