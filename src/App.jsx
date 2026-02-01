import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Ajuste o caminho conforme sua pasta
import Login from './views/login';

function App() {
  return (
    // O AuthProvider precisa ser o "Pai" de todos para o Dispatch funcionar
    <AuthProvider>
      <div className="App">
        <Login />
      </div>
    </AuthProvider>
  );
}

export default App;