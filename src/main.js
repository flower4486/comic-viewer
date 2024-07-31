import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import mixin from './utils/mixin';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

let pinia = createPinia();
createApp(App).mixin(mixin).use(pinia).use(ElementPlus).use(router).mount('#app');
