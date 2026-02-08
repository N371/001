import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 1. Criação da instância
const api = axios.create({
  baseURL: 'http://localhost:3000' 
});

// 2. Configuração do Mock
const mock = new MockAdapter(api, { delayResponse: 1000 });

// 3. Definição do Mock de Login
mock.onPost('/Login').reply((config) => {
  const { email } = JSON.parse(config.data);
  
  console.log(`[SIMULADOR 001] Processando login para: ${email}`);

  return [200, {
    status: 200,
    msg: "Autenticação Confirmada",
    token: "TOKEN_SANTOS_DUMONT_2026_XYZ",
    user: { 
      id_usuario: 1001, 
      nome: "Nelson", 
      id_empresa: 500,
      empresa: "Global XML"
    }
  }];
});

export default api;