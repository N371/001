import api from './api'; // Certifique-se que o caminho para o seu api.js está correto

export const getMenuService = async () => {
    try {
        // Esta chamada será interceptada pelo mock que configuramos no api.js
        const response = await api.get('/menu-sections');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do menu:", error);
        throw error; // Repassa o erro para o Dashboard tratar
    }
};