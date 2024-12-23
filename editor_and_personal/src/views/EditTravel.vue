<!-- src/views/EditTravel.vue -->
<template>
  <div class="edit-travel-container">
    <div class="editor-container">
      <Editor />
    </div>
    <div class="editor-history">
      <History />
    </div>
  </div>
</template>

<script>
import Editor from '../components/Editor.vue';
import History from '../components/History.vue';

export default {
  name: 'EditTravel',
  components: {
    Editor,
    History,
  },
};
</script>

<style scoped>
.editor-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.editor-history {
  width: 360px;
  padding: 10px;
  box-sizing: border-box;
  border-left: 3px solid darkgreen;
}

.edit-travel-container {
  display: flex;
  height: 100%;
}

.editor-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.editor-history {
  width: 360px;
  padding: 10px;
  box-sizing: border-box;
  border-left: 3px solid darkgreen;
}
</style>
