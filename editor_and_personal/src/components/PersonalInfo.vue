<template>
  <div class="personal-info-container">
    <div v-if="isLoggedIn" class="info-card">
      <div class="left-column">
        <img :src="'http://localhost:8080' + personalInfo.avatarUrl" alt="Avatar" class="avatar" />
        <p class="user-id">ID: {{ personalInfo.id }}</p>
      </div>
      <div class="right-column">
        <div class="user-info">
          <h1>{{ personalInfo.nickname }}</h1>
          <p class="signature">{{ personalInfo.signature }}</p>
          <p>旅游打卡数: {{ personalInfo.travelCheckInCount }}</p>
        </div>

      </div>
      <!-- 发帖数、点赞数、评论数 横向排列 -->
      <div class="stats">
        <p>发帖数: {{ personalInfo.postCount }}</p>
        <p>点赞数: {{ personalInfo.likeCount }}</p>
        <p>评论数: {{ personalInfo.commentCount }}</p>
      </div>
      <div class="button-group">
        <button @click="openEditModal">管理信息</button>
        <button @click="logout">退出账号</button>
      </div>
    </div>
    <div v-else class="not-logged-in">
      <p>还没有登陆哦，点击 <span class="login-register" @click="openLoginRegisterModal">此处</span> 注册/登陆</p>
      <!-- 注册/登录弹窗占位 -->
    </div>

    <!-- 模块：历史足迹、我的游记、成就 -->
    <div v-if="isLoggedIn" class="module">
      <div class="module-header">
        <button :class="{ active: currentTab === 'historyFootprints' }" @click="currentTab = 'historyFootprints'">历史足迹</button>
        <button :class="{ active: currentTab === 'myTravelNotes' }" @click="currentTab = 'myTravelNotes'">我的游记</button>
        <button :class="{ active: currentTab === 'achievements' }" @click="currentTab = 'achievements'">成就</button>
      </div>
      <div class="module-content">
        <div v-if="currentTab === 'historyFootprints'">
          <!-- 历史足迹内容（留空） -->
        </div>
        <div v-if="currentTab === 'myTravelNotes'">
          <!-- 我的游记内容（留空） -->
        </div>
        <div v-if="currentTab === 'achievements'">
          <!-- 成就内容（留空） -->
        </div>
      </div>
    </div>

    <!-- 编辑信息模态框 -->
    <InfoModel v-if="isEditModalOpen" @close="isEditModalOpen = false" />

    <!-- 登录/注册模态框 -->
    <LoginRegisterModal v-if="isLoginRegisterModalOpen" @close="isLoginRegisterModalOpen = false" />
  </div>
</template>

<script>
import { useJournalStore } from '../store';
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed } from 'vue';
import InfoModel from './InfoModel.vue';
import LoginRegisterModal from './LoginRegisterModal.vue';

export default {
  name: 'PersonalInfo',
  components: {
    InfoModel,
    LoginRegisterModal,
  },
  setup() {
    const journalStore = useJournalStore();
    const { personalInfo, isLoggedIn } = storeToRefs(journalStore);

    const isEditModalOpen = ref(false);
    const isLoginRegisterModalOpen = ref(false);

    const logout = () => {
      journalStore.logout();
    };

    const openEditModal = () => {
      isEditModalOpen.value = true;
    };

    const openLoginRegisterModal = () => {
      isLoginRegisterModalOpen.value = true;
    };

    onMounted(() => {
      journalStore.initializeStore();
      if (journalStore.isLoggedIn) {
        journalStore.fetchPersonalInfo();
      }
    });

    const currentTab = ref('historyFootprints');

    const avatarUrl = computed(() => {
      return personalInfo.value.avatarUrl
        ? 'http://localhost:8080' + personalInfo.value.avatarUrl
        : 'http://localhost:8080/uploads/default-avatar.png';
    });

    return {
      personalInfo,
      isLoggedIn,
      isEditModalOpen,
      logout,
      openEditModal,
      isLoginRegisterModalOpen,
      openLoginRegisterModal,
      currentTab,
      avatarUrl
    };
  },
};
</script>

<style scoped>
.personal-info-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 将内容水平居中 */
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0px;
}

.info-card {
  display: flex;
  border: 4px solid #86A356;
  background-color: #F1F5E9;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%; /* 控制卡片的宽度 */
  max-width: 1300px; /* 限制最大宽度 */
  justify-content: space-between; /* 确保内容分布均匀 */
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 保证子项之间有间距 */
  flex: 0.8; /* 保证左右列占据相等的空间 */
}

.left-column {
  align-items: center;
  margin-right: 10px;
  border: 2px solid yellow;
  flex: 0.8;
}

.right-column{
  padding-top: 10px;
  padding-bottom: 10px;
}

.avatar {
  width: 170px;
  height: 170px;
  padding-top: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.user-id {
  margin-top: 10px;
  font-weight: bold;
  font-size: 20px;
  color: #575757;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* 占满右侧区域 */
  font-size: 20px;
}

.signature {
  font-style: italic;
  color: #666;
  margin: 5px 0;
  font-size: 16px;
}

/* 发帖数、点赞数、评论数 横向排列 */
.stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1.2; /* 让 stats 区域占据可用空间 */
  border: 1px solid black;
}

.stats p {
  margin: 0;
  font-size: 16px;
  flex: 1; /* 让每个统计项有相等的宽度 */
  text-align: center; /* 使统计项居中显示 */

}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1; /* 让按钮区域占据可用空间 */
  justify-content: center;
  align-items: center; /* 将按钮居中 */
  border: 1px solid black;
}

.button-group button {
  padding: 15px 20px;
  background-color: #54750d;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 200px; /* 固定按钮宽度 */

  font-size: 18px;
}

.button-group button:hover {
  background-color: green;
}

.not-logged-in {
  text-align: center;
  margin-top: 50px;
}

.login-register {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.module {
  display: flex;
  width: 90%;
  max-width: 1500px; /* 限制最大宽度 */
  border-bottom: 2px solid #54750d;
  margin: 10px auto; /* 居中 */
}

.module-header {
  display: flex;
  justify-content: space-around; /* 水平均匀分布 */
  border-bottom: 3px solid #ccc;
  width: 50%; /* 限制宽度为父容器的一半 */
  margin: 0 auto; /* 居中对齐 */
}

.module-header button {
  flex: 1; /* 让每个按钮占相等宽度 */
  padding: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-align: center; /* 文字居中 */

  font-size: 18px;
  letter-spacing: 2px;
}

.module-header button.active {
  border-bottom: 3px solid darkgreen;
  color: darkgreen;
}

.module-content {
  padding: 20px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
}

</style>
