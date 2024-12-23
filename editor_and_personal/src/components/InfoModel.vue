<!-- src/components/EditUserInfoModal.vue -->
<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>编辑个人信息</h3>
      <form @submit.prevent="handleSave">
        <div class="form-group">
          <label for="avatar">头像:</label>
          <input type="file" id="avatar" @change="onAvatarChange" />
          <img v-if="previewAvatar" :src="previewAvatar" alt="Preview Avatar" class="avatar-preview" />
        </div>
        <div class="form-group">
          <label for="nickname">昵称:</label>
          <input type="text" id="nickname" v-model="editableInfo.nickname" required />
        </div>
        <div class="form-group">
          <label for="signature">个人签名/简介:</label>
          <textarea id="signature" v-model="editableInfo.signature"></textarea>
        </div>
        <div class="form-group">
          <label for="birthday">生日:</label>
          <input type="date" id="birthday" v-model="editableInfo.birthday" />
        </div>
        <div class="form-group">
          <label for="gender">性别:</label>
          <select id="gender" v-model="editableInfo.gender">
            <option value="">请选择</option>
            <option value="Male">男</option>
            <option value="Female">女</option>
            <option value="Other">其他</option>
          </select>
        </div>
        <div class="button-group">
          <button type="submit">保存</button>
          <button type="button" @click="$emit('close')">取消</button>
        </div>
        <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useJournalStore } from '../store';

export default {
  name: 'EditUserInfoModal',
  setup(props, { emit }) {
    const journalStore = useJournalStore();
    const { personalInfo } = journalStore;
    const editableInfo = ref({ ...journalStore.personalInfo });
    const successMessage = ref('');
    const errorMessage = ref('');

    const previewAvatar = ref(null);

    // 监听personalInfo的变化，更新编辑信息
    watch(
        () => personalInfo.value,
        (newVal) => {
          editableInfo.value = { ...newVal };
        },
        { immediate: true }
    );

    const onAvatarChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          previewAvatar.value = reader.result; // 更新头像预览
        };
        reader.readAsDataURL(file); // 读取文件为base64格式

        try {
          await journalStore.uploadAvatar(file);
          successMessage.value = '头像上传成功';
        } catch (error) {
          errorMessage.value = '头像上传失败';
        }
      }
    };

    // const submitEdit = async () => {
    //   // 实现头像上传逻辑
    //   // 目前，假设avatarUrl是base64字符串，直接保存
    //   await journalStore.savePersonalInfo();
    //   emit('close');
    // };
    const handleSave = async () => {
      try {
        journalStore.personalInfo = editableInfo.value; // 更新仓库中的个人信息
        await journalStore.savePersonalInfo();
        successMessage.value = '个人信息已保存';
        emit('close');
      } catch (error) {
        errorMessage.value = '保存个人信息失败';
      }
    };

    return {
      editableInfo,
      onAvatarChange,
      handleSave,
      previewAvatar,
      successMessage,
      errorMessage
    };
  },
};
</script>

<style scoped>
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
  z-index: 1000; /* 确保在顶部 */
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.button-group button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button[type="submit"] {
  background-color: darkgreen;
  color: white;
}

.button-group button[type="button"] {
  background-color: #ccc;
  color: #333;
}
</style>
