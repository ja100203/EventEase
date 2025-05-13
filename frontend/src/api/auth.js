// src/api/auth.js
import axios from './axios';

export const loginUser = 
(credentials) =>
   axios.post('/users/login', credentials, { withCredentials: true });

export const signupUser = 
(userData) => 
  axios.post('/users/register', userData,credentials, { withCredentials: true });
