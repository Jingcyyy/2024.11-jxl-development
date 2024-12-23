// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
// import Editor from '../components/Editor.vue';
import home from "../components/home.vue";
import PersonalInfo from "../components/PersonalInfo.vue";
import EditTravel from '../views/EditTravel.vue';

// 定义路由
const routes = [
  { path: '/', component: home }, // 首页
  { path: '/editor', component: EditTravel },
  { path: '/personal', component: PersonalInfo }, // 个人信息
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;