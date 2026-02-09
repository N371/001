import React, { useEffect, useState } from 'react';
import { FaUserShield, FaEdit, FaTrashAlt, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import { getUsersService, createUserService } from '../../services/user/userService.js'; 
import { formatCPF, isValidCPF, isValidEmail } from '../../utils/formatters';

const UserAdmin = ({ colors }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '', email: '', cargo: '', cpf: '', nivel: 'Operacional'
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersService();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar lista", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Lógica de Salvamento com Validação FAV +2
  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Validar E-mail
    if (!isValidEmail(formData.email)) {
      alert("⚠️ E-mail inválido! Por favor, verifique o formato.");
      return;
    }

    // 2. Validar CPF
    if (!isValidCPF(formData.cpf)) {
      alert("⚠️ CPF inválido! O algoritmo de verificação não bate.");
      return;
    }

    try {
      await createUserService(formData);
      setShowModal(false);
      setFormData({ nome: '', email: '', cargo: '', cpf: '', nivel: 'Operacional' });
      loadUsers(); 
      alert("🚀 Usuário decolou com sucesso!");
    } catch (err) {
      alert("❌ Erro ao salvar usuário no sistema.");
    }
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.text,
    outline: 'none',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out', position: 'relative' }}>
      
      {/* 1. CABEÇALHO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Gestão de Usuários</h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>Controle de acesso dos comandantes e tripulantes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ 
            backgroundColor: colors.accent, color: '#fff', border: 'none', 
            padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
          }}>
          <FaPlus /> Novo Usuário
        </button>
      </div>

      {/* 2. TABELA DE CONSULTA */}
      <div style={{ backgroundColor: colors.sidebar, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>Sincronizando...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: colors.hover, textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '15px' }}>Usuário / Cargo</th>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Nível</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${colors.border}`, fontSize: '0.85rem' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: '600' }}>{u.nome}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{u.cargo || 'Não definido'}</div>
                  </td>
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
                      <FaEdit style={{ cursor: 'pointer', color: colors.accent }} />
                      <FaUserShield style={{ cursor: 'pointer', color: '#10b981' }} title="Vincular Empresas" />
                      <FaTrashAlt style={{ cursor: 'pointer', color: '#ef4444' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. MODAL DE CADASTRO */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: colors.sidebar, padding: '30px', borderRadius: '16px',
            width: '450px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Novo Usuário</h2>
              <FaTimes onClick={() => setShowModal(false)} style={{ cursor: 'pointer', opacity: 0.5 }} />
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Nome Completo</label>
                <input required type="text" value={formData.nome} 
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>E-mail Profissional</label>
                <input 
                  required 
                  type="text" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{
                    ...inputStyle,
                    borderColor: formData.email && !isValidEmail(formData.email) ? '#ef4444' : colors.border
                  }} 
                  placeholder="exemplo@email.com"
                />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Cargo</label>
                  <input required type="text" value={formData.cargo} 
                    onChange={e => setFormData({...formData, cargo: e.target.value})}
                    style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>CPF</label>
                  <input 
                    required 
                    type="text" 
                    maxLength="14" 
                    value={formData.cpf} 
                    onChange={e => setFormData({...formData, cpf: formatCPF(e.target.value)})}
                    style={{
                      ...inputStyle,
                      borderColor: formData.cpf.length === 14 && !isValidCPF(formData.cpf) ? '#ef4444' : colors.border
                    }}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <button type="submit" style={{ 
                marginTop: '10px', backgroundColor: colors.accent, color: '#fff', border: 'none', 
                padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}>
                <FaSave /> Salvar e Autorizar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;