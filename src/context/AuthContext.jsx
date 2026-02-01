import React, { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext();

// 1. O Reducer: Onde a mágica do estado acontece
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true
      };
    case 'LOGOUT':
      localStorage.removeItem('@App001:token');
      return {
        token: null,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

// 2. O Provider: O "Cofre" que envolve a aplicação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: localStorage.getItem('@App001:token'),
    user: null,
    isAuthenticated: !!localStorage.getItem('@App001:token')
  });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso
export const useAuth = () => useContext(AuthContext);