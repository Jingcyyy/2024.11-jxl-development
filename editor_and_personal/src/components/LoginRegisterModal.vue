  <template>
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <button :class="{ active: isLogin }" @click="toggleMode('login')">登录</button>
          <button :class="{ active: !isLogin }" @click="toggleMode('register')">注册</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- 注册模式 -->
            <div v-if="!isLogin">
              <label for="registerUsername">用户名:</label>
              <input type="text" id="registerUsername" v-model="registerUsername" required />
            </div>
            <!-- 登录模式 -->
            <div v-if="isLogin">
              <label for="username">用户名:</label>
              <input type="text" id="loginUsername" v-model="username" required />
            </div>
            <div>
              <label for="password">密码:</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="success-message" v-if="successMessage">{{ successMessage }}</div>
            <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="$emit('close')">关闭</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useJournalStore } from '../store';
  
  export default {
    name: 'LoginRegisterModal',
    setup(props, { emit }) {
      const isLogin = ref(true);
      const username = ref('');
      const password = ref('');
      const registerUsername = ref('');
      const registerNickname = ref('');
      const successMessage = ref('');
      const errorMessage = ref('');
      const journalStore = useJournalStore();
      let mounted = false;  // 跟踪组件是否挂载
  
      const isRegister = computed(() => !isLogin.value);
  
      const toggleMode = (mode) => {
        isLogin.value = mode === 'login';
        successMessage.value = '';
        errorMessage.value = '';
        // 清空输入字段
        if (isLogin.value) {
          registerUsername.value = '';
          registerNickname.value = '';
        } else {
          password.value = '';  // 清空密码字段
        }
          username.value = '';
      };
  
      const handleSubmit = async () => {
        if (!mounted) return;
        successMessage.value = '';
        errorMessage.value = '';
  
        if (isLogin.value) {
          try {
            console.log('Login attempt with username:', username.value, 'and password:', password.value);
            await journalStore.login(username.value, password.value);
            emit('close');
          } catch (error) {
            if (error.message === '账号不存在，请先注册。') {
              // 自动切换到注册模式
              isLogin.value = false;
              errorMessage.value = '';
              registerUsername.value = username.value;
              successMessage.value = '账号不存在，请注册一个新账号。';
            } else {
              errorMessage.value = error.message;
            }
          }
        } else {
          if (!registerUsername.value || !password.value) {
            errorMessage.value = '用户名和密码不能为空';
            return;
          }
          try {
            const nickname = '默认昵称';
            await journalStore.register(registerUsername.value, nickname, password.value);
            successMessage.value = '注册成功，已自动登录。';
            // 可选：在短暂延迟后关闭模态框
            setTimeout(() => {
              emit('close');
            }, 1500);
          } catch (error) {
            errorMessage.value = error.message;
          }
        }
      };
  
      // 组件挂载时设置 mounted 为 true
      onMounted(() => {
        mounted = true;
      });
  
      onBeforeUnmount(() => {
        mounted = false;
      });
  
      return {
        isLogin,
        username,
        password,
        registerUsername,
        registerNickname,
        toggleMode,
        handleSubmit,
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
    padding: 20px;
    border-radius: 8px;
    width: 400px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .modal-header button {
    flex: 1;
    padding: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  .modal-header button.active {
    border-bottom: 2px solid darkgreen;
    color: darkgreen;
  }
  
  .modal-body {
    display: flex;
    flex-direction: column;
  }
  
  .modal-body form {
    display: flex;
    flex-direction: column;
  }
  
  .modal-body label {
    margin-bottom: 5px;
  }
  
  .modal-body input {
    margin-bottom: 15px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .modal-body button {
    padding: 10px;
    background-color: #54750d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modal-body button:hover {
    background-color: green;
  }
  
  .error-message {
    color: red;
    margin-bottom: 10px;
  }
  
  .success-message {
    color: green;
    margin-bottom: 10px;
  }
  
  .modal-footer {
    text-align: right;
  }
  
  .modal-footer button {
    padding: 8px 12px;
    background-color: #ccc;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modal-footer button:hover {
    background-color: #bbb;
  }
  </style>
  