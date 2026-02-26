import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';

// Componente para proteger las rutas que requieren estar logueado
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-request" element={<ResetPasswordRequest />} />
        {/* Nota: Esta es la ruta que recibe el link del correo desde el backend */}
        <Route path="/api/reset-password" element={<ResetPasswordConfirm />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;