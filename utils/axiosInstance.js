// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000/api', // Asegúrate de que esta sea la URL de tu API Django
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;