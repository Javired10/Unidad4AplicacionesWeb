import axios from 'axios';

const api = axios.create({
    // Usa la variable de entorno de Vite o cae en localhost si no está definida
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;