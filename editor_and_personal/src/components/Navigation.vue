<!--</style>-->

<template>
  <nav class="navigation">
    <ul>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/community">社区</router-link></li>
      <li><router-link to="/editor">游记编辑</router-link></li>
      <li><router-link to="/personal">个人信息</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
};
</script>

<style scoped>
/* 侧栏的容器样式 */
.navigation {
  width: 250px;
  background-color: #62992B;
  color: white;
  padding-top: 50px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  border-radius: 0 10px 10px 0;
}

/* 导航列表样式 */
.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 单个导航项样式 */
.navigation li {
  margin: 15px 0;
  margin-left: 40px;
  margin-top: 20px;
  text-align: center;
  transition: background-color 0.3s ease;
}

/* 鼠标悬停时高亮导航项 */
.navigation li:hover {
  background-color: #62992B;
  border-radius: 50px 0 0 50px ;
}

/* 链接样式 */
.navigation a {
  display: block;

  border-radius: 50px 0 0 50px ;

  color: white;
  text-decoration: none;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  padding: 35px 0;
  margin-left: 20px;
  border: 4px solid white;  /* 初始无边框 */
  border-right: none;
  transition: color 0.2s ease, border-color 0.2s ease; /* 平滑过渡效果 */
}

/* 鼠标悬停时修改文字颜色和边框 */
.navigation a:hover {
  color: #62992B;
  border-color: #62992B;  /* 增加边框颜色 */
  border-radius: 50px 0 0 50px ;  /* 边框圆角 */
  background-color: white;
  font-weight: bold;
}

/* 选中状态的链接样式 */
.navigation a.router-link-active {
  border-radius: 50px 0 0 50px ;
  font-weight: bold;
  color: #62992B;
  border-color: white;  /* 选中时设置边框颜色 */
  background-color: white;
}
</style>
