import React, { useEffect, useState } from 'react';
import { FaUserShield, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { getUsersService } from '../../services/user/userService.js'; // Vamos criar este service em seguida

const UserAdmin = ({ colors }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Simulando a busca de usuários do escritório
        const data = await getUsersService();
        setUsers(data);
      } catch (err) {
        console.error("Erro ao carregar lista de usuários", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Gestão de Usuários</h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Controle de acessos e poderes das empresas vinculadas.</p>
        </div>
        <button style={{ 
          backgroundColor: colors.accent, color: '#fff', border: 'none', 
          padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
        }}>
          <FaPlus /> Novo Usuário
        </button>
      </div>

      <div style={{ backgroundColor: colors.sidebar, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Carregando usuários do sistema...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>Usuário</th>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Nível</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${colors.border}`, fontSize: '0.85rem' }}>
                  <td style={{ padding: '15px', fontWeight: '500' }}>{u.nome}</td>
                  <td style={{ padding: '15px', opacity: 0.8 }}>{u.email}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      backgroundColor: u.nivel === 'Master' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                      color: u.nivel === 'Master' ? colors.accent : colors.text,
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold'
                    }}>
                      {u.nivel}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                      <FaEdit style={{ cursor: 'pointer', color: colors.accent }} title="Editar Poderes" />
                      <FaUserShield style={{ cursor: 'pointer', color: '#10b981' }} title="Empresas Vinculadas" />
                      <FaTrashAlt style={{ cursor: 'pointer', color: '#ef4444' }} title="Excluir" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserAdmin;