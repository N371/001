import React, { useState } from 'react';
import { PostService } from '../../services';
import { useAuth } from '../../context/AuthContext'; // Importamos o nosso Hook de Autenticação

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado local para o feedback do botão

  // Puxamos o dispatch do nosso Contexto Global
  const { dispatch } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o "Aguarde..."
  
    const dataPost = {
        email : email,
        senha : senha
    };

    try {
        // O PostService cuida do Pako, do Base64 e do envio para o Python
        const response = await PostService('/Login', dataPost, 'userlogin');
        
        console.log("Resposta final na View:", response);

        // SE O LOGIN FOR SUCESSO (Status 200 vindo do Python)
        if (response.status === 200 && response.token) {
            
            // 1. Gravamos no LocalStorage para o Service usar no Header Authorization
            localStorage.setItem('@App001:token', response.token);
            localStorage.setItem('@App001:user', JSON.stringify(response.user));

            // 2. DISPATCH: Enviamos os dados para o Estado Global (Contexto)
            dispatch({ 
                type: 'LOGIN_SUCCESS', 
                payload: { 
                    token: response.token, 
                    user: response.user 
                } 
            });

            console.log("Sistema Autenticado e Token Armazenado!");
            // Futuramente: navigate('/dashboard');
        } else {
            alert("Falha: " + response.msg);
        }

    } catch (error) {
        console.error("Erro na comunicação do Service:", error);
    } finally {
        setLoading(false); // Desativa o loading independente do resultado
    }
  };

  return (
    <div className="login-container">
      {/* Design focado em Sistemas Enterprise: Simples e Direto */}
      <div className="login-card">
          <h2>Aeronave 001 - Acesso</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>E-mail:</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading} // Bloqueia input enquanto processa
                required 
              />
            </div>
            <br />
            <div className="input-group">
              <label>Senha:</label>
              <input 
                type="password" 
                autoComplete="new-password"
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                disabled={loading}
                required 
              />
            </div>
            <br />
            {/* O botão agora responde ao estado do sistema */}
            <button type="submit" disabled={loading}>
              {loading ? 'Comprimindo e Autenticando...' : 'Entrar'}
            </button>
          </form>
      </div>
    </div>
  );
};

export default Login;