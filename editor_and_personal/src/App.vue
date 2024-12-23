<template>
  <meta charset="UTF-8">

  <div class="app-container">
    <Navigation />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation,
  },
};
</script>

<style>
/* 容器布局 */
.app-container {
  display: flex;
  height: 100vh; /* 高度占满屏幕 */
  position: relative; /* 为了在小屏幕下实现侧栏的折叠效果 */
}

/* 侧栏部分 */
.navigation {
  width: 235px; /* 侧栏宽度 */
  background-color: #2c3e50;
  color: white;
  padding-top: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed; /* 固定在屏幕左侧 */
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10; /* 确保侧栏位于最上层 */
  border-radius: 0 10px 10px 0; /* 圆角效果 */
}

/* 主内容区域 */
.main-content {
  margin-left: 250px; /* 确保内容不被侧栏遮挡 */
  flex: 1;
  padding: 20px;
  overflow: auto;
  transition: margin-left 0.3s ease; /* 平滑过渡效果 */
}

/* 响应式设计：当屏幕宽度小于 768px 时，隐藏侧栏 */
@media (max-width: 768px) {
  .navigation {
    width: 200px; /* 缩小侧栏宽度 */
    padding-top: 10px;
  }

  .main-content {
    margin-left: 0; /* 在小屏幕上内容区域占满屏幕 */
  }
}
</style>
