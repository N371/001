import axios from 'axios';
import pako from 'pako';

/**
 * SERVICE DE LOGIN - PROJETO 001
 * Estrutura: Pako (Gzip) + Base64 + Gerenciamento de Token JWT
 */
export const loginService = async (dataPost, metodo, Section) => {
  
  switch(Section) {
    case '/Login':
      { 
        const jsonString = JSON.stringify(dataPost);
        const compressed = pako.gzip(jsonString);
        const base64Data = btoa(String.fromCharCode.apply(null, compressed));
        const token = localStorage.getItem('@App001:token');
        const configAjax = {
            method: 'post',
            url: 'http://localhost:3000/api/controllerLogin.java', 
            data: {
                pp: base64Data,        
                ll: 'LoginController', 
                kk: metodo,
                compressed: true       
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            timeout: 5000 
        };
        console.log(`[AJAX] Seção ${Section} preparada.`);
        try {
            const { pp, ll, kk } = configAjax.data;
            console.log("=== INSPEÇÃO DE VOO (ENVIANDO...) ===");
            console.log("PP (Gzip+Base64):", pp);
            console.log("LL (Controller):", ll);
            console.log("KK (Método):", kk);
            console.log("Token Enviado:", configAjax.headers['Authorization'] || "Nenhum (Primeiro Acesso)");
            const response = await axios(configAjax);
            return response.data;
        } catch (error) {
            console.log("Erro na requisição de Login:", error);
            return { 
                status: 500, 
                msg: "Erro de conexão: O servidor não respondeu.",
                detalhes: error.message 
            };
        }
      }

    case '/Logout':
      {
        const token = localStorage.getItem('@App001:token');
        const configAjax = {
            method: 'post',
            url: 'http://localhost:3000/api/controllerLogout.java',
            data: {
                pp: dataPost,
                ll: 'LoginController',
                kk: metodo
            },
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            timeout: 2000 
        };

        try {
            const response = await axios(configAjax);
            return response.data;
        } catch (error) {
            console.log("Erro no Logout:", error);
            return { status: 200, msg: "Logout local efetuado" };
        }
      }   

    default:
      {
         console.log("Seção não encontrada no loginService");
         return { status: 404, msg: "Seção inexistente" };
      }    
  }
};