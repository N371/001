import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: 'http://localhost:3000' 
});

const mock = new MockAdapter(api, { delayResponse: 1000 });

// 1. Mock de Login
mock.onPost('/Login').reply((config) => {
  const { email } = JSON.parse(config.data);
  console.log(`[SIMULADOR 001] Processando login para: ${email}`);
  
  return [200, {
    status: 200,
    msg: "Autenticação Confirmada",
    token: "TOKEN_SANTOS_DUMONT_2026_XYZ",
    user: { 
      id_usuario: 1001, 
      nome: "Nelson Contador", 
      id_empresa: 500,
      empresa: "Global XML Contabilidade",
      is_master: true // Define que ele é o dono da conta
    }
  }];
});

// 2. Mock das Seções do Menu (Atualizado com Administração)
mock.onGet('/menu-sections').reply(200, [
  { 
    title: 'DOCUMENTOS', 
    icon: 'FaFileInvoice', 
    items: ['Nfe', 'Nfe-em etapas', 'NFSe', 'CTe', 'CFe Sat', 'NFCe', 'MDFe', 'Outros documentos'] 
  },
  { 
    title: 'ADMINISTRAÇÃO', 
    icon: 'FaCog', 
    items: ['Usuários', 'Grupos de Acesso', 'Empresas', 'Configurações'] 
  },
  { 
    title: 'RELATÓRIOS', 
    icon: 'FaChartBar', 
    items: ['NF-e', 'CT-e', 'NFS-e'] 
  },
  { 
    title: 'PRODUTIVIDADE', 
    icon: 'FaCog', 
    items: ['Fechamento de mês', 'Automações'] 
  }
]);

// 3. Mock de Detalhes do Usuário (Hierarquia de Poderes para o Contador)
mock.onGet('/user-details').reply(200, {
  id_usuario: 1001,
  cnpj_principal: "12.345.678/0001-90", // CNPJ do escritório responsável
  usuario_principal: "Nelson Master",
  is_master: true,
  
  // Empresas que este contador gerencia no sistema
  empresas_vinculadas: [
    { id: 500, cnpj: "00.111.222/0001-00", razao: "Padaria Alfa", poderes: ["LER", "CADASTRAR", "DELETAR"] },
    { id: 501, cnpj: "99.888.777/0001-99", razao: "Oficina Beta", poderes: ["LER", "CONSULTAR"] }
  ],
  
  // O que ele pode fazer na tela de Administração de Usuários
  permissoes_adm: {
    pode_criar_usuarios: true,
    pode_atribuir_poderes: true,
    pode_vincular_empresas: true
  }
});

// 4. Mock para Listagem Geral de Usuários (Para a tela de Admin)
mock.onGet('/admin/users').reply(200, [
  { id: 1, nome: "Nelson Master", email: "nelson@contato.com", nivel: "Master" },
  { id: 2, nome: "Auxiliar João", email: "joao@contato.com", nivel: "Operacional" },
  { id: 3, nome: "Auxiliar Maria", email: "maria@contato.com", nivel: "Operacional" }
]);

mock.onPost('/admin/users').reply((config) => {
  const newUser = JSON.parse(config.data);
  console.log(`[SIMULADOR 001] Criando novo usuário: ${newUser.nome}`);
  
  return [201, { 
    status: 201, 
    msg: "Usuário decolou com sucesso!", 
    user: { ...newUser, id: Math.floor(Math.random() * 1000) } 
  }];
});

export default api;