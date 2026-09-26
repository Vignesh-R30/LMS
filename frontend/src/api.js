import axios from 'axios';

// Create a central axios instance connected to your live backend
const api = axios.create({
    baseURL: 'https://lms-aifv.onrender.com/api',
});

// Automatically attach the JWT token to every request if the user is logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
