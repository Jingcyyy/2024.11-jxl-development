// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端 API 基础路径
  headers: {
      'Content-Type': 'application/json'
  },
  timeout: 10000,
});

// 请求拦截器（添加认证 Token 等）
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // 假设使用 localStorage 存储 Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器（统一错误处理）
api.interceptors.response.use(
  response => response,
  error => {
    // 可以在这里添加统一的错误提示
    return Promise.reject(error);
  }
);

export default api;
