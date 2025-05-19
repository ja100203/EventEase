// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5600/api',
});

instance.interceptors.request.use((config) => {
  let auth = null;
  try {
    auth = JSON.parse(localStorage.getItem('auth'));
  } catch (e) {
    console.warn('Invalid auth data in localStorage');
  }

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default instance;
