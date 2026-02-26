import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Check for existing token and redirect
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('Conectando...');
    setError(false);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        // Persist token to local storage
        localStorage.setItem('token', data.access);
        navigate('/dashboard');
      } else {
        setMensaje(data.detail || 'Credenciales incorrectas');
        setError(true);
      }
    } catch (err) {
      setMensaje('Error de conexión');
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">SECURITY CAST</h2>
          <p className="text-sm text-gray-500 mt-1">Acceso al sistema</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="admin@securitycast.com"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="••••••••"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
          >
            Iniciar Sesión
          </button>
          
          <div className="text-center mt-4">
            <Link to="/reset-request" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

        {mensaje && (
          <div className={`mt-5 p-3 rounded-lg text-center text-sm font-semibold border ${error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;