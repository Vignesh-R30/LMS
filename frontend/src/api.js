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

// Automatically log out if the backend says the token is invalid or the user is deleted
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;
