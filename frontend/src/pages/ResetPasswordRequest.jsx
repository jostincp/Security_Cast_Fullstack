import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    setError(false);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMensaje('Enlace enviado. Revisa tu bandeja de entrada.');
        setError(false);
        setEmail('');
      } else {
        setMensaje(data.msg || 'Ocurrió un error al procesar la solicitud.');
        setError(true);
      }
    } catch (err) {
      setMensaje('Error al procesar la solicitud.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <h2 className="text-2xl font-black text-center text-gray-800 tracking-tight mb-2">Recuperar Acceso</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Ingresa tu correo para recibir un enlace de recuperación seguro.</p>
        
        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
              placeholder="tu@correo.com"
              required 
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white font-bold py-2.5 rounded-lg transition-all focus:ring-4 focus:ring-green-300 ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Enviando...' : 'Enviar Enlace'}
          </button>
          
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800 font-medium hover:underline">
              ← Volver al Login
            </Link>
          </div>
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

export default ResetPasswordRequest;