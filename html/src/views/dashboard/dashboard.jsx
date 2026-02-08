import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { getMenuService } from '../../services/menuService';
import UserAdmin from './UserAdmin'; // Importaremos o novo componente aqui
import { 
  FaFileInvoice, FaCloudUploadAlt, FaChartBar, FaCog, FaExclamationTriangle 
} from 'react-icons/fa';

const iconMap = {
  FaFileInvoice: <FaFileInvoice />,
  FaCloudUploadAlt: <FaCloudUploadAlt />,
  FaChartBar: <FaChartBar />,
  FaCog: <FaCog />
};

const Dashboard = () => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('@App001:theme') || 'dark');
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // ESTADO PARA NAVEGAÇÃO INTERNA
  const [activeTab, setActiveTab] = useState('Painel de Controle');

  useEffect(() => {
    let isMounted = true;
    const loadMenuData = async () => {
      try {
        setLoading(true);
        const data = await getMenuService();
        if (isMounted) setMenuSections(data);
      } catch (err) {
        console.error("Erro na ignição do Menu:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadMenuData();
    return () => { isMounted = false; };
  }, []);

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

  // FUNÇÃO QUE DECIDE O QUE MOSTRAR NO CONTEÚDO PRINCIPAL
  const renderMainContent = () => {
    if (activeTab === 'Usuários') {
      return <UserAdmin colors={colors} />;
    }

    // Visão Padrão: Painel de Controle (Cards)
    return (
      <>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Painel de Controle</h1>
          <p style={{ opacity: 0.6 }}>Bem-vindo de volta ao comando, {user?.nome || 'Usuário'}.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {['Total NF-e (Mês)', 'CT-e Processados', 'Alertas de Erro'].map((label) => (
            <div key={label} style={{ 
              padding: '25px', background: colors.sidebar, 
              borderRadius: '12px', border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.6 }}>{label}</span>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '10px' }}>
                {label.includes('Erro') ? '0' : Math.floor(Math.random() * 100)}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', 
      backgroundColor: colors.bg, color: colors.text, overflow: 'hidden',
      transition: 'background-color 0.3s ease'
    }}>
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        <aside style={{ 
          width: '260px', backgroundColor: colors.sidebar, 
          borderRight: `1px solid ${colors.border}`, 
          display: 'flex', flexDirection: 'column', overflowY: 'auto' 
        }}>
          <nav style={{ padding: '15px' }}>
            {loading ? (
              <p style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'center', marginTop: '20px' }}>Sincronizando...</p>
            ) : error ? (
              <p style={{ textAlign: 'center', color: '#ef4444' }}>Erro no menu.</p>
            ) : (
              menuSections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: '25px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', 
                    fontSize: '0.7rem', fontWeight: '800', color: colors.accent, 
                    marginBottom: '10px', textTransform: 'uppercase' 
                  }}>
                    {iconMap[section.icon] || <FaFileInvoice />} {section.title}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {section.items.map((item, i) => (
                      <li key={i} 
                          onClick={() => setActiveTab(item)} // CLIQUE ALTERNA A TAB
                          style={{ 
                            padding: '8px 10px 8px 30px', fontSize: '0.8rem', 
                            cursor: 'pointer', borderRadius: '4px', transition: '0.2s',
                            backgroundColor: activeTab === item ? colors.hover : 'transparent',
                            color: activeTab === item ? colors.accent : colors.text,
                            fontWeight: activeTab === item ? '600' : 'normal'
                          }}
                          onMouseEnter={(e) => {
                            if(activeTab !== item) e.target.style.backgroundColor = colors.hover
                          }}
                          onMouseLeave={(e) => {
                            if(activeTab !== item) e.target.style.backgroundColor = 'transparent'
                          }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;