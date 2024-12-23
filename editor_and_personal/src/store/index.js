// src/store/index.js
import { defineStore } from 'pinia';
import api from '../services/api';
import {ref, toRaw} from "vue";

export const useJournalStore = defineStore('journal', {
  state: () => ({
    journals: [],
    currentJournal: {

      id: null,
      title: '未命名笔记',
      content: '',
      mediaList: [],
      updatedAt: null
    },
    originalJournalState: null, // 用于检测未保存更改
    isGraphicMode: false, // 图文模式开关
    personalInfo: {
      id: null,
      avatarUrl: '',
      nickname: '',
      signature: '',
      birthday: null,
      gender: '',
      postCount: 0,
      likeCount: 0,
      commentCount: 0,
      travelCheckInCount: 0
    },
    isLoggedIn: false, // 登录状态
    token: '', // JWT 令牌
    isEditModalOpen: false,
    isLoginRegisterModalOpen: false,
    currentTab: 'historyFootprints', // 模块标签
  }),
  getters: {
    hasUnsavedChanges(state) {
      if (!state.originalJournalState) return false;
      return (
          state.currentJournal.title !== state.originalJournalState.title ||
          state.currentJournal.content !== state.originalJournalState.content ||
          JSON.stringify(state.currentJournal.mediaList) !== JSON.stringify(state.originalJournalState.mediaList)
      );
    },
    isCurrentJournalEmpty(state) {
      return (
          !state.currentJournal.title.trim() &&
          !state.currentJournal.content.trim() &&
          state.currentJournal.mediaList.length === 0
      );
    }
  },
  actions: {
    // 获取所有游记
    async fetchJournals() {
      try {
        const response = await api.get('/travel-journals');
        this.journals = response.data;
        console.log("Current data:", toRaw(this.journals));
      } catch (error) {
        console.error('获取游记列表失败:', error);
      }
    },
    // 创建新游记
    async createJournal() {
      try {
        const response = await api.post('/travel-journals', {
          title: '新游记',
          content: '',
          mediaList: []
        });
        // this.journals.push(response.data);
        this.journals = [...this.journals, response.data];
        await this.selectJournal(response.data.id);
      } catch (error) {
        console.error('创建游记失败:', error);
      }
    },
    // 保存当前游记
    async saveCurrentJournal() {
      try {
        console.log("Current Journal before save:", this.currentJournal);
        if (this.currentJournal.id) {
          const response = await api.put(`/travel-journals/${this.currentJournal.id}`, this.currentJournal);
          console.log('Updated Journal:', response.data);

          const index = this.journals.findIndex(j => j.id === this.currentJournal.id);
          if (index !== -1) {
            this.journals[index] = response.data;
          }
          this.currentJournal = response.data;
        } else {
          // 创建新游记
          await this.createJournal();
          return;
        }
        // 更新 originalJournalState
        this.originalJournalState = JSON.parse(JSON.stringify(this.currentJournal));

        console.log("Fetching journals after save");
        await this.fetchJournals();
      } catch (error) {
        console.error('保存游记失败:', error);
      }
    },
    // 选择并加载游记
    async selectJournal(id) {
      try {
        const response = await api.get(`/travel-journals/${id}`);
        this.currentJournal = response.data;
        this.originalJournalState = JSON.parse(JSON.stringify(this.currentJournal));
      } catch (error) {
        console.error('加载游记失败:', error);
      }
    },
    // 重置当前游记为上次保存的状态
    resetCurrentJournal() {
      if (this.originalJournalState) {
        this.currentJournal = JSON.parse(JSON.stringify(this.originalJournalState));
      } else {
        // 如果没有原始状态，重置为默认新游记
        this.currentJournal = {
          id: null,
          title: '新游记',
          content: '',
          mediaList: [],
          updatedAt: null
        };
        this.originalJournalState = JSON.parse(JSON.stringify(this.currentJournal));
      }
    },
    // 切换图文模式
    setGraphicMode(value) {
      this.isGraphicMode = value;
    },
    // 上传媒体文件
    async uploadMedia(file, type) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        const response = await api.post(`/travel-journals/${this.currentJournal.id}/media`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const media = response.data;
        this.currentJournal.mediaList.push(media);
        // 更新 originalJournalState
        this.originalJournalState = JSON.parse(JSON.stringify(this.currentJournal));
        return media; // 返回上传后的媒体对象
      } catch (error) {
        console.error('上传媒体失败:', error);
        throw error;
      }
    },
    async deleteJournals(ids) {
      try {
        await api.delete('/travel-journals', {data: ids});
        this.journals = this.journals.filter(journal => !ids.includes(journal.id));
      } catch (error) {
        console.error('删除游记失败:', error);
      }
    },
    initializeStore() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.isLoggedIn = true;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.fetchPersonalInfo();
      }
    },

    // 登录动作
    async login(username, password) {
      try {
        console.log('Login Request Body:', { username, password });
        const response = await api.post('/user/login', { username, password });
        this.token = response.data.token;
        this.isLoggedIn = true;
        localStorage.setItem('token', this.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        await this.fetchPersonalInfo();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          throw new Error('账号不存在，请先注册。');
        } else {
          throw new Error('登录失败，请检查用户名和密码。');
        }
      }
    },

    // 注册动作
    async register(username, nickname, password) {
      try {
        console.log('Register Request Body:', { username, nickname, password });
        const response = await api.post('/user/register', { username, nickname, password });
        this.token = response.data.token;
        this.isLoggedIn = true;
        localStorage.setItem('token', this.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        await this.fetchPersonalInfo();
      } catch (error) {
        if (error.response && error.response.data === 'Username already exists') {
          throw new Error('用户名已存在。');
        } else if (error.response && error.response.data === 'Nickname already exists') {
          throw new Error('昵称已存在。');
        } else if (error.response && error.response.data === 400) {
          console.error('Bad Request:', error.response.data);
          throw new Error('注册失败，参数不正确或服务器错误。');
        } else {
          throw new Error('注册失败，请重试。');
        }
      }
    },

    // 登出动作
    logout() {
      this.token = '';
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      // 重置个人信息
      this.personalInfo = {
        id: null,
        avatarUrl: '',
        nickname: '',
        signature: '',
        birthday: null,
        gender: '',
        postCount: 0,
        likeCount: 0,
        commentCount: 0,
        travelCheckInCount: 0
      };
      alert('已退出登录');
    },

    // 获取个人信息
    async fetchPersonalInfo() {
      try {
        const response = await api.get('/user/personal-info');
        this.personalInfo = response.data;
      } catch (error) {
        console.error('获取个人信息失败:', error);
        this.isLoggedIn = false;
        this.logout();
      }
    },

    // 保存个人信息
    async savePersonalInfo() {
      try {
        const response = await api.put('/user/personal-info', this.personalInfo);
        this.personalInfo = response.data;
        alert('个人信息已保存');
      } catch (error) {
        console.error('保存个人信息失败:', error);
        alert('保存个人信息失败，请重试。');
      }
    },

    // 上传头像
    async uploadAvatar(file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/user/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.personalInfo.avatarUrl = response.data;
        alert('头像上传成功');
      } catch (error) {
        console.error('上传头像失败:', error);
        alert('上传头像失败，请重试。');
      }
    },
  },
});
