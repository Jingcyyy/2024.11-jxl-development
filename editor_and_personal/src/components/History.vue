<!-- src/components/History.vue -->
<template>
  <div class="history">
    <div class="history-header">
      <h3>历史笔记</h3>
      <button @click="toggleDeleteMode">{{ deleteMode ? '确认删除' : '删除笔记' }}</button>
    </div>
    <ul>
      <li
          v-for="history in journals"
          :key="history.id"
          @click="handleSelect(history.id)"
          :class="{ selected: isSelected(history.id) }"
      >
        <div>{{ history.title }}</div>
        <div class="preview-line">{{ getFirstLine(history.content) }}</div>
        <div class="timestamp">{{ formatDate(history.updatedAt) }}</div>
      </li>
    </ul>
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner">加载中...</div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { useJournalStore } from '../store';
import {computed, onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";

export default {
  setup() {
    const journalStore = useJournalStore();
    const { journals } = storeToRefs(journalStore); // journals 为 ref

    const deleteMode = ref(false); // 定义 deleteMode
    const selectedJournals = ref([]); // 选中的笔记 ID 列表

    const isLoading = ref(false);
    const errorMessage = ref('');

    onMounted(() => {
      journalStore.fetchJournals();
    });

    // 在组件挂载时获取游记列表
    journalStore.fetchJournals();

    function getFirstLine(content) {
      return content.split('\n')[0] || '';
    }

    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      const Y = d.getFullYear();
      const M = String(d.getMonth() + 1).padStart(2, '0');
      const D = String(d.getDate()).padStart(2, '0');
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      return `${Y}.${M}.${D} ${h}:${m}:${s}`;
    }

    function toggleDeleteMode() {
      if (deleteMode.value) {
        // 当前在删除模式，执行删除操作
        if (selectedJournals.value.length === 0) {
          alert('请选择要删除的笔记。');
          return;
        }
        if (confirm('确认删除所选的笔记吗？')) {
          deleteSelectedJournals();
        }
      } else {
        // 进入删除模式
        deleteMode.value = true;
        selectedJournals.value = [];
      }
    }

    function handleSelect(id) {
      if (!deleteMode.value) {
        // 如果不在删除模式，可以执行其他操作，如加载笔记
        // 例如：
        journalStore.selectJournal(id);
        return;
      }
      const index = selectedJournals.value.indexOf(id);
      if (index > -1) {
        // 已选中，取消选择
        selectedJournals.value.splice(index, 1);
      } else {
        // 未选中，添加到选择列表
        selectedJournals.value.push(id);
      }
    }

    function isSelected(id) {
      return selectedJournals.value.includes(id);
    }

    async function deleteSelectedJournals() {
      try {
        isLoading.value = true;
        await journalStore.deleteJournals(selectedJournals.value);
        selectedJournals.value = [];
        deleteMode.value = false;
        alert('选定的笔记已删除。');
      } catch (error) {
        errorMessage.value = '删除笔记失败，请重试。';
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }

    return {
      journals,
      getFirstLine,
      formatDate,
      toggleDeleteMode,
      handleSelect,
      isSelected,
      isLoading,
      errorMessage,
      deleteMode // 确保 deleteMode 被返回
    };
  }
};
</script>

<style scoped>
.history {
  padding: 20px;
  position: relative;
}
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.history-header h3 {
  margin: 0;
}
.history-header button {
  padding: 8px 12px;
  background-color: #f44336; /* 红色 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.history-header button:hover {
  background-color: #d32f2f;
}
.history ul {
  list-style-type: none;
  padding: 0;
}
.history li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s;
}
.history li.selected {
  background-color: #ffdddd; /* 选中时的背景色 */
}
.history li:hover {
  background-color: #f0f0f0;
}
.preview-line {
  color: #666;
  font-size: 0.9em;
}
.timestamp {
  font-size: 0.8em;
  color: #999;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid darkgreen;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
