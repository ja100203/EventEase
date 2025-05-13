import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5600/api', // or wherever your backend is running
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
