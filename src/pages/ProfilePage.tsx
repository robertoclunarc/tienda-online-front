import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

interface ProfilePageProps {
  activeTab?: 'profile' | 'orders' | 'password' | 'settings';
}

interface UserFormData {
  nombreUser: string;
  emailUser: string;
  tlfUser: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface Order {
  idVenta: number;
  fechaVenta: string;
  montoTotalVenta: string;
  estatusVenta: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ activeTab = 'profile' }) => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'password' | 'settings'>(activeTab);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    nombreUser: '',
    emailUser: '',
    tlfUser: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Actualizar la pestaña activa cuando cambia la prop
  useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  // Formulario para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    if (user) {
      setFormData({
        nombreUser: user.nombreUser || '',
        emailUser: user.emailUser || '',
        tlfUser: user.tlfUser || '',
      });
    }
  }, [user]);

  // Cargar pedidos del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoadingOrders(true);
        const response = await api.get(`/ventas/usuario/${user.idCuentaUser}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        toast.error('No se pudieron cargar los pedidos');
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario de perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Actualizar perfil
      await updateProfile({
        nombreUser: formData.nombreUser,
        tlfUser: formData.tlfUser,
      });
      
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar envío del formulario de cambio de contraseña
  // Manejar envío del formulario de cambio de contraseña
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    try {
      setSubmittingPassword(true);
      
      await api.post('/auth/change-password', {
        userId: user?.idCuentaUser,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      // Limpiar el formulario
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Contraseña actualizada correctamente');
      
      // Opcional: redirigir al perfil general
      navigate('/perfil');
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al cambiar la contraseña');
      }
      console.error('Error al cambiar la contraseña:', error);
    } finally {
      setSubmittingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> No se pudo cargar la información del usuario.</span>
        </div>
      </div>
    );
  }  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Menú lateral */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
              <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                  {user?.nombreUser?.[0] || user?.emailUser?.[0] || 'U'}
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900 dark:text-white">{user.nombreUser || 'Usuario'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.emailUser}</p>
                </div>
              </div>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                <button
                    onClick={() => setCurrentTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      currentTab === 'profile' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-user mr-2"></i>
                    Perfil
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('password')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      currentTab === 'password' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-key mr-2"></i>
                    Cambiar Contraseña
                  </button>
                </li>
                <li>
                <button
                    onClick={() => setCurrentTab('orders')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      currentTab === 'orders' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-box mr-2"></i>
                    Pedidos
                  </button>
                </li>
                <li>
                <button
                    onClick={() => setCurrentTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded-md ${
                      currentTab === 'settings' 
                        ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Configuración
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Perfil */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Información de Perfil</h2>
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label htmlFor="nombreUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        id="nombreUser"
                        name="nombreUser"
                        value={formData.nombreUser}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="emailUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="emailUser"
                        name="emailUser"
                        value={formData.emailUser}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">El email no se puede cambiar</p>
                    </div>
                    <div>
                      <label htmlFor="tlfUser" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="tlfUser"
                        name="tlfUser"
                        value={formData.tlfUser}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Pedidos */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Mis Pedidos</h2>
                
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="spinner"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No tienes pedidos realizados.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nº Pedido
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Estado
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order) => (
                          <tr key={order.idVenta}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                #{order.idVenta}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.fechaVenta).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 dark:text-white">
                                ${parseFloat(order.montoTotalVenta).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.estatusVenta === 'COMPLETADO' 
                                  ? 'bg-green-100 text-green-800' 
                                  : order.estatusVenta === 'PENDIENTE'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {order.estatusVenta}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                                Ver detalles
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Cambiar Contraseña */}
            {currentTab === 'password' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Cambiar Contraseña</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submittingPassword}
                    className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center"
                  >
                    {submittingPassword ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Cambiando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key mr-2"></i>
                        Cambiar contraseña
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Configuración */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Configuración</h2>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;