import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import mixin from './utils/mixin';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

createApp(App).mixin(mixin).use(ElementPlus).use(router).mount('#app');
