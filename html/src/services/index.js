import api from '../api'; // Ele busca a configuração da API com o Mock já pronto

export const loginService = async (dataPost, metodo, rota) => {
    try {
        // Chamada direta via Axios (que será interceptada pelo Mock no api.js)
        const response = await api.post(rota, dataPost);
        
        // Retornamos apenas os dados da resposta
        return response.data;
    } catch (error) {
        console.error("Falha na ignição do Service:", error);
        return { 
            status: 500, 
            msg: "Erro de comunicação com o simulador." 
        };
    }
};