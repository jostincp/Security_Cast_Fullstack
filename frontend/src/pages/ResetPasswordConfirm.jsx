import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Extract URL parameters
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleResetConfirm = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError(true);
      setMensaje('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setMensaje('Actualizando contraseña...');
    setError(false);
    
    try {
      const url = `http://127.0.0.1:8000/api/reset-password/?uid=${uid}&token=${token}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMensaje('Contraseña actualizada exitosamente. Redirigiendo...');
        setError(false);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setMensaje(data.msg || 'El enlace es inválido o ha expirado.');
        setError(true);
      }
    } catch (err) {
      setMensaje('Error de conexión con el servidor.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Enlace Inválido</h2>
          <p className="text-gray-600 mb-4">El enlace de recuperación está incompleto.</p>
          <Link to="/reset-request" className="text-blue-600 hover:underline">Solicitar un nuevo enlace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <h2 className="text-2xl font-black text-center text-gray-800 tracking-tight mb-2">Nueva Contraseña</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Ingresa tu nueva contraseña para recuperar el acceso.</p>
        
        <form onSubmit={handleResetConfirm} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="••••••••"
              required 
              minLength="8"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              placeholder="••••••••"
              required 
              minLength="8"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-2.5 rounded-lg transition-all focus:ring-4 focus:ring-purple-300 ${loading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {loading ? 'Guardando...' : 'Cambiar Contraseña'}
          </button>
        </form>

        {mensaje && (
          <div className={`mt-5 p-3 rounded-lg text-center text-sm font-semibold border ${error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;