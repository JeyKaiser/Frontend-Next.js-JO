// // utils/axiosInstance.js
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://192.168.0.40:8000/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Interceptor para añadir el token de autenticación a cada solicitud
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get('auth_token'); // Asume que el token se guarda con el nombre 'auth_token'
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;


// utils/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

// Función para obtener la URL correcta del backend
function getBackendUrl() {
    if (typeof window !== 'undefined') {
        const currentHost = window.location.hostname;
        
        // Si estamos accediendo desde localhost o 127.0.0.1
        if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
            return 'http://localhost:8000/api';
        }
        
        // Si estamos accediendo desde la IP de la red local
        if (currentHost === '192.168.0.40') {
            return 'http://192.168.0.40:8000/api';
        }
        
        // Fallback: usar la misma IP del frontend
        return `http://${currentHost}:8000/api`;
    }
    
    // En el servidor (SSR), usar variable de entorno o localhost por defecto
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    return `${baseUrl}/api`;
}

const axiosInstance = axios.create({
    baseURL: getBackendUrl(),
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
