import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch, FaMoon, FaSun, FaUserCircle, FaSignOutAlt, FaIdBadge } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ theme, toggleTheme }) => {
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fechar o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@App001:token');
    localStorage.removeItem('@App001:user');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const styles = {
    navbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.5rem 1.5rem', height: '55px', flexShrink: 0, width: '100%', boxSizing: 'border-box',
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      borderBottom: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
      zIndex: 1000
    },
    searchBar: {
      display: 'flex', alignItems: 'center', borderRadius: '20px', width: '300px', padding: '5px 15px',
      background: theme === 'dark' ? '#334155' : '#f1f5f9',
    },
    dropdown: {
      position: 'absolute', top: '50px', right: '0', width: '220px',
      backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
      borderRadius: '8px', padding: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
      zIndex: 1001
    },
    dropdownItem: {
      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
      fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', transition: '0.2s',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* LADO ESQUERDO: Empresa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <FaBars style={{ cursor: 'pointer' }} />
        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#3b82f6' }}>
          {user?.empresa ? user.empresa.toUpperCase() : 'SANTOS DUMONT 001'}
        </span>
      </div>

      {/* CENTRO: Busca */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={styles.searchBar}>
          <FaSearch style={{ color: '#94a3b8', marginRight: '10px', fontSize: '0.8rem' }} />
          <input 
            type="text" placeholder="Buscar..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', color: 'inherit', fontSize: '0.85rem', width: '100%' }} 
          />
        </div>
      </div>

      {/* LADO DIREITO: Tema e Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div onClick={toggleTheme} style={{ cursor: 'pointer' }}>
          {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
        </div>

        {/* CONTÊINER DO AVATAR */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: '600', opacity: 0.9 }}>
              {user?.nome || 'Entrar'}
            </span>
            <FaUserCircle size={26} style={{ color: '#3b82f6' }} />
          </div>

          {/* MENU DROPDOWN */}
          {showDropdown && user && (
            <div style={styles.dropdown}>
              <div style={{ padding: '5px 10px 10px 10px', borderBottom: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, marginBottom: '5px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.nome}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                  <FaIdBadge /> ID Empresa: {user.id_empresa}
                </div>
              </div>

              <div 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => { setShowDropdown(false); alert('Perfil em construção'); }}
              >
                <FaUserCircle /> Meu Perfil
              </div>

              <div 
                style={{ ...styles.dropdownItem, color: '#ef4444' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#450a0a' : '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Sair da Conta
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;