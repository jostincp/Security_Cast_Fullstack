import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, LogOut, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, full_name: '', email: '', password: '', is_active: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/users/', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }
      
      if (!response.ok) throw new Error('Error al cargar los usuarios');
      
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsuarios(usuarios.filter(user => user.id !== id));
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({ id: user.id, full_name: user.full_name, email: user.email, password: '', is_active: user.is_active });
      setIsEditing(true);
    } else {
      setFormData({ id: null, full_name: '', email: '', password: '', is_active: true });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/users/${formData.id}/` 
      : 'http://127.0.0.1:8000/api/users/';
    
    const method = isEditing ? 'PUT' : 'POST';

    const payload = { ...formData };
    if (isEditing && !payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchUsuarios();
        setModalOpen(false);
      } else {
        const errData = await response.json();
        alert('Error al guardar: ' + JSON.stringify(errData));
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Panel de Control</h1>
            <p className="text-gray-500 mt-1">Gestión de usuarios del sistema</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button 
              onClick={() => openModal()} 
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <Plus size={18} /> Nuevo Usuario
            </button>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-red-50 hover:text-red-600 transition font-medium border border-gray-200"
            >
              <LogOut size={18} /> Salir
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Correo</th>
                                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {usuarios.map(user => (
                                      <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>   
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle size={12} /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md hover:bg-blue-100 transition" title="Editar">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md hover:bg-red-100 transition" title="Eliminar">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No hay usuarios registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Crear/Editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Contraseña {isEditing && <span className="text-gray-400 font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required={!isEditing} minLength="8" />
              </div>
              <div className="flex items-center mt-4">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900 font-medium">Usuario Activo</label>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;