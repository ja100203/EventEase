import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5600/api',
    // baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Intercept requests to attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Attaching Token to Request:", token); // <-- Token log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
