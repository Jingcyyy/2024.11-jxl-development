<template>
  <div class="header">
    <div class="left-buttons">
      <button @click="newNote">新建</button>
      <button @click="saveNote">保存</button>
    </div>
    <div class="notetitle" @click="editTitle">
      <input v-if="isEditing" ref="titleInput" v-model="title" @keyup.enter="confirmEdit" @blur="confirmEdit" />
      <span v-else>{{ notetitle }}</span>
    </div>
    <div class="right-buttons">
      <button @click="triggerUpload('image')">上传图片</button>
      <button @click="triggerUpload('video')">上传视频</button>
    </div>
  </div>
  <!-- 图文模式下展示的媒体缩略图 -->
  <div v-if="isGraphicMode" class="media-thumbnails">
    <div v-for="(m, index) in mediaList" :key="index" class="thumbnail-item">
      <img v-if="m.type==='image'" :src="m.url" alt="media" />
      <video v-if="m.type==='video'" :src="m.url" controls width="100"></video>
    </div>
  </div>
</template>

<script>
import { useJournalStore } from '../store'; // 确保路径正确
import { computed } from 'vue';

export default {
  name: 'Header',
  props: {
    notetitle: {
      type: String,
      default: '未命名笔记'
    },
    mediaList: {
      type: Array,
      default: () => []
    },
    isGraphicMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save-note', 'new-note', 'update-title', 'upload-media'],
  setup() {
    const journalStore = useJournalStore();

    const title = computed({
      get: () => journalStore.currentJournal.title,
      set: (newTitle) => {
        journalStore.currentJournal.title = newTitle;
      }
    });

    return {
      journalStore,
      title
    };
  },
  // data() {
  //   return {
  //     isEditing: false,
  //     editableTitle: this.notetitle
  //   };
  // },
  // watch: {
  //   notetitle(newTitle) {
  //     this.editableTitle = newTitle;
  //   }
  // },
  // methods: {
  //   newNote() {
  //     this.$emit('new-note');
  //   },
  //   saveNote() {
  //     this.$emit('save-note');
  //   },
  //   editTitle() {
  //     this.isEditing = true;
  //     this.$nextTick(() => {
  //       this.$refs.titleInput && this.$refs.titleInput.focus();
  //     });
  //   },
  //   confirmEdit() {
  //     this.isEditing = false;
  //     this.$emit('update-title', this.editableTitle);
  //   },
  //   triggerUpload(type) {
  //     this.$emit('upload-media', type);
  //   }
  // }
  data() {
    return {
      isEditing: false
    };
  },
  methods: {
    newNote() {
      this.$emit('new-note');
    },
    saveNote() {
      this.$emit('save-note');
    },
    editTitle() {
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.titleInput && this.$refs.titleInput.focus();
      });
    },
    confirmEdit() {
      this.isEditing = false;
    },
    triggerUpload(type) {
      this.$emit('upload-media', type);
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-bottom: 2px solid #54750d;
}
.notetitle {
  flex-grow: 1;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}
.notetitle input {
  width: 50%;
  padding: 5px;
  font-size: 20px;
}
.left-buttons button,
.right-buttons button {
  margin-right: 10px;
  font-size: 18px;
}
.media-thumbnails {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f0f0f0;
  gap: 10px;
  overflow-x: auto;
}
.thumbnail-item img, .thumbnail-item video {
  max-height: 80px;
}
</style>