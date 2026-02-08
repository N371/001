import api from './api';

export const getUsersService = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lista de usuários:", error);
    throw error;
  }
};