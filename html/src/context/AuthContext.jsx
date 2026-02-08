import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true, 
        token: action.payload.token, 
        user: action.payload.user 
      };
    case 'LOGOUT':
      return { isAuthenticated: false, token: null, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  // Estado inicial buscando do localStorage para não perder o login no F5
  const initialState = {
    token: localStorage.getItem('@App001:token') || null,
    user: JSON.parse(localStorage.getItem('@App001:user')) || null,
    isAuthenticated: !!localStorage.getItem('@App001:token'),
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado com trava de segurança
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};