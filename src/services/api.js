import axios from 'axios';

// Criamos uma instância personalizada do Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Sua URL do Rocky Linux
    timeout: 5000
});

// O INTERCEPTOR: O "Pedágio de Segurança"
api.interceptors.request.use(
    (config) => {
        // Buscamos o token que o Java nos deu no login
        const token = localStorage.getItem('@App001:token');

        if (token) {
            // Se o token existe, ele é anexado ao cabeçalho da requisição
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`[Segurança] Token anexado para: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;