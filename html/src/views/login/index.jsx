import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from "../../services/login/index"; 
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header'; // Importando o componente padrão

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Lógica de Tema
  const [theme, setTheme] = useState(localStorage.getItem('@App001:theme') || 'dark');

  const { dispatch } = useAuth();
  const navigate = useNavigate(); 

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('@App001:theme', newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataPost = { email, senha };

    try {
        const response = await loginService(dataPost, 'POST', '/Login');
        
        if (response.status === 200 && response.token) {
            localStorage.setItem('@App001:token', response.token);
            localStorage.setItem('@App001:user', JSON.stringify(response.user));

            dispatch({ 
                type: 'LOGIN_SUCCESS', 
                payload: { token: response.token, user: response.user } 
            });

            console.log("Login efetuado. Comandante:", response.user.nome);
            navigate('/dashboard'); 
        } else {
            alert(response.msg || "Erro na autenticação.");
        }
    } catch (error) {
        console.error("Falha Crítica na View de Login:", error);
    } finally {
        setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      color: theme === 'dark' ? 'white' : '#1e293b',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    },
    loginCard: {
      margin: 'auto',
      padding: '2rem',
      background: theme === 'dark' ? '#1e293b' : '#ffffff',
      borderRadius: '8px',
      boxShadow: theme === 'dark' ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      width: '350px',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginTop: '5px',
      borderRadius: '4px',
      border: '1px solid #64748b',
      backgroundColor: theme === 'dark' ? '#334155' : '#fff',
      color: theme === 'dark' ? 'white' : 'black',
      boxSizing: 'border-box',
      outline: 'none'
    },
    button: {
      width: '100%',
      padding: '12px',
      cursor: loading ? 'not-allowed' : 'pointer',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '1rem',
      marginTop: '10px',
      opacity: loading ? 0.7 : 1
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER PADRONIZADO - Agora em todas as telas! */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div style={styles.loginCard}>
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>Aeronave 001</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500' }}>E-mail:</label>
              <input 
                type="email" 
                style={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="piloto@globalxml.com"
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '500' }}>Senha:</label>
              <input 
                type="password" 
                style={styles.input} 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Aquecendo Turbinas...' : 'Iniciar Voo'}
            </button>
          </form>
      </div>
    </div>
  );
};

export default Login;