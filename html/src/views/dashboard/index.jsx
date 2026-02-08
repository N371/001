import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { 
  FaFileInvoice, FaBarcode, FaCloudUploadAlt, FaChartBar, FaCog 
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('@App001:theme') || 'dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('@App001:theme', newTheme);
  };

  const colors = {
    bg: theme === 'dark' ? '#0f172a' : '#f8fafc',
    sidebar: theme === 'dark' ? '#1e293b' : '#ffffff',
    text: theme === 'dark' ? '#f8fafc' : '#1e293b',
    accent: '#3b82f6',
    border: theme === 'dark' ? '#334155' : '#e2e8f0',
    hover: theme === 'dark' ? '#334155' : '#f1f5f9'
  };

  const menuSections = [
    { title: 'DOCUMENTOS', icon: <FaFileInvoice />, items: ['Nfe', 'Nfe-em etapas', 'NFSe', 'CTe', 'CFe Sat', 'NFCe', 'MDFe', 'Outros documentos'] },
    { title: 'CAPTURA E ENVIO', icon: <FaCloudUploadAlt />, items: ['Integrações', 'Recuperar Nota', 'Sincroniza Nota', 'Importar XMLs'] },
    { title: 'RELATÓRIOS', icon: <FaChartBar />, items: ['NF-e', 'CT-e', 'NFS-e'] },
    { title: 'PRODUTIVIDADE', icon: <FaCog />, items: ['Fechamento de mês', 'Automações'] }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: colors.bg, 
      color: colors.text,
      overflow: 'hidden' 
    }}>
      
      {/* HEADER PADRONIZADO */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SIDEBAR */}
        <aside style={{
          width: '260px',
          backgroundColor: colors.sidebar,
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          {/* Opções rápidas logo abaixo do header na sidebar 
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px', fontSize: '0.7rem', borderBottom: `1px solid ${colors.border}`, background: colors.hover, fontWeight: 'bold' }}>
            <span>RECEBIDAS</span>
            <span>EMITIDAS</span>
            <span>CITADAS</span>
          </div>   */}

          <nav style={{ padding: '15px' }}>
            {menuSections.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', fontWeight: '800', color: colors.accent, marginBottom: '10px', textTransform: 'uppercase' }}>
                  {section.icon} {section.title}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ padding: '8px 10px 8px 30px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Painel de Controle</h1>
            <p style={{ opacity: 0.6 }}>Bem-vindo de volta ao comando, {user?.nome}.</p>
          </header>

          {/* Grid de Cards de Exemplo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {['Total NF-e (Mês)', 'CT-e Processados', 'Alertas de Erro'].map((label) => (
              <div key={label} style={{ padding: '25px', background: colors.sidebar, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>{label}</span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>
                  {label.includes('Erro') ? '0' : Math.floor(Math.random() * 100)}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;