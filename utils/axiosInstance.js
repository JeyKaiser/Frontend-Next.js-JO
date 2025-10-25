// utils/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://192.168.0.40:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token de autenticación a cada solicitud
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token'); // Asume que el token se guarda con el nombre 'auth_token'
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;