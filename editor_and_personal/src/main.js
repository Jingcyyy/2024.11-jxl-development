// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useJournalStore } from './store';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.mount('#app');

// 初始化仓库
const journalStore = useJournalStore();
journalStore.initializeStore();
