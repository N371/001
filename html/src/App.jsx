import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

import Login from "./views/login/login.jsx";
import Dashboard from "./views/dashboard/dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // Garantindo que o contexto envolva tudo

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota inicial: Login */}
          <Route path="/" element={<Login />} />
          
          {/* Rota Protegida: Só acessa se tiver token */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Rota de escape: Se digitar qualquer coisa errada, volta para o Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;