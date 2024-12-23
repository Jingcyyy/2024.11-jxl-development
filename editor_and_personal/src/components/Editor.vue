<!-- src/components/Editor.vue -->
<template>
  <div class="editor">
    <Header
        :notetitle="noteTitle"
        :mediaList="currentNote.mediaList"
        :isGraphicMode="isGraphicMode"
        @save-note="saveNote"
        @new-note="createNewNote"
        @update-title="updateNoteTitle"
        @upload-media="openFileDialog"
    />

    <input ref="fileInput" type="file" style="display:none" @change="uploadMedia" />

    <div class="mode-toggle">
      <label>
        <input type="checkbox" v-model="isGraphicMode" />
        图文模式
      </label>
    </div>

    <div class="editor-container">
      <div class="editor-main">
        <textarea
            ref="textarea"
            v-model="content"
            placeholder="在这里写下你的游记..."
            class="editor-textarea"
            @input="onContentChange"
        ></textarea>
        <div v-if="isGraphicMode && currentNote.mediaList.length" class="media-list">
          <h4>媒体列表</h4>
          <div v-for="media in currentNote.mediaList" :key="media.id" class="media-item">
            <div v-if="media.type === 'image'">
              <img :src="'http://localhost:8080' + media.url" alt="Image" class="media-thumbnail" />
            </div>
            <div v-else-if="media.type === 'video'">
              <video :src="'http://localhost:8080' + media.url" controls class="media-thumbnail"></video>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner">加载中...</div>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { useJournalStore } from '../store';
import { storeToRefs } from 'pinia';
import Header from './Header.vue';
import { computed, ref } from "vue";

export default {
  components: {
    Header,
  },
  setup() {
    const journalStore = useJournalStore();
    const { currentJournal, isGraphicMode } = storeToRefs(journalStore);

    const fileInput = ref(null);
    const textarea = ref(null);

    const noteTitle = computed({
      get: () => currentJournal.value.title,
      set: (val) => {
        currentJournal.value.title = val;
      }
    });

    const content = computed({
      get: () => currentJournal.value.content,
      set: (val) => {
        currentJournal.value.content = val;
      }
    });

    const isLoading = ref(false);
    const errorMessage = ref('');

    function onContentChange() {
      // 内容变化处理，可在此标记未保存状态
    }

    async function createNewNote() {
      if (journalStore.hasUnsavedChanges) {
        const shouldSave = confirm("当前内容未保存，是否保存当前编辑？");
        if (shouldSave) {
          try {
            isLoading.value = true;
            await saveNote();
          } catch (error) {
            errorMessage.value = '保存笔记失败，请重试。';
            console.error(error);
            return;
          } finally {
            isLoading.value = false;
          }
        } else {
          await journalStore.resetCurrentJournal(); // 重置当前笔记为上次保存的状态

        }
      }
      try {
        isLoading.value = true;
        await journalStore.createJournal(); // 创建新笔记
      } catch (error) {
        errorMessage.value = '创建新笔记失败，请重试。';
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }

    async function saveNote() {
      try {
        isLoading.value = true;
        await journalStore.saveCurrentJournal();
        alert('笔记已保存');
        await journalStore.fetchJournals(); // 刷新历史笔记列表
      } catch (error) {
        errorMessage.value = '保存笔记失败，请重试。';
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }

    function updateNoteTitle(newTitle) {
      currentJournal.value.title = newTitle;
    }

    function openFileDialog(type) {
      fileInput.value.dataset.type = type;
      fileInput.value.click();
    }

    async function uploadMedia(e) {
      const file = e.target.files[0];
      if (!file) return;
      const type = fileInput.value.dataset.type; // 'image' or 'video'

      try {
        isLoading.value = true;
        await journalStore.uploadMedia(file, type);
        alert('媒体上传成功');
      } catch (error) {
        errorMessage.value = '媒体上传失败，请重试。';
        console.error(error);
      } finally {
        isLoading.value = false;
      }

      fileInput.value.value = null; // 重置input
    }

    function insertAtCursor(text) {
      const el = textarea.value;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      el.value = before + text + after;
      content.value = el.value; // 同步content
      // 重置光标位置
      const pos = start + text.length;
      el.selectionStart = el.selectionEnd = pos;
      el.focus();
    }

    return {
      noteTitle,
      content,
      createNewNote,
      saveNote,
      updateNoteTitle,
      openFileDialog,
      uploadMedia,
      textarea,
      fileInput,
      onContentChange,
      isGraphicMode,
      currentNote: currentJournal,
      isLoading,
      errorMessage
    };
  },
};
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  position: relative;
}
.editor-main {
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
}
.editor-textarea {
  width: 95%;
  height: 400px;
  background-color: #fffff4;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  resize: vertical;
  font-size: 18px;
}
.mode-toggle {
  padding: 10px;
  background: #f4f4f4;
}
.media-list {
  margin-top: 20px;
}
.media-item {
  margin-bottom: 10px;
}
.media-thumbnail {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
}
</style>
