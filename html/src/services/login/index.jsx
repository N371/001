import api from '../api';

export const loginService = async (dataPost, metodo, rota) => {
    try {
        // Realiza o POST usando a instância com o Adapter
        const response = await api.post(rota, dataPost);
        
        // Retornamos o data (que é o objeto com status, token e user)
        return response.data;
    } catch (error) {
        console.error("Erro no Service de Decolagem:", error);
        return { 
            status: 500, 
            msg: "Falha técnica nos motores da API" 
        };
    }
};