import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal: string;
  metodoPago: 'tarjeta' | 'transferencia' | 'efectivo';
  numeroTarjeta?: string;
  fechaExpiracion?: string;
  cvv?: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: user?.nombreuser || '',
    email: user?.emailuser || '',
    telefono: user?.tlfuser || '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
    metodoPago: 'tarjeta',
  });

  // Verificar si hay productos en el carrito
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('No hay productos en el carrito');
      navigate('/carrito');
    }
  }, [cartItems, navigate]);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Preparar los datos de la venta
      const venta = {
        fkCuentaUser: user?.idcuentauser || 1, // Asumiendo que el usuario está autenticado
        montoTotalVenta: cartTotal,
        // Otros campos según tu modelo de venta
      };
      
      // Preparar los detalles de la venta
      const detalles = cartItems.map(item => ({
        fkProducto: item.fkproducto,
        precioUnitario: item.precio || '0.0',
        cantProducto: item.cantproducto,
        subTotal: item.montototal
      }));
      
      // Enviar la venta al servidor
      const response = await api.post('/ventas', { venta, detalles });
      
      // Limpiar el carrito
      await clearCart();
      
      toast.success('¡Compra realizada con éxito!');
      
      // Redirigir a una página de confirmación
      navigate(`/pedido-confirmado/${response.data.id}`);
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Error al procesar el pago:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de checkout */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold mb-4">Información de contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Dirección de envío</h2>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="pais" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    id="pais"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">Método de pago</h2>
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === 'tarjeta'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Tarjeta de crédito</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Transferencia bancaria</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === 'efectivo'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Efectivo al recibir</span>
                  </label>
                </div>

                {formData.metodoPago === 'tarjeta' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="numeroTarjeta" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        id="numeroTarjeta"
                        name="numeroTarjeta"
                        value={formData.numeroTarjeta || ''}
                        onChange={handleChange}
                        placeholder="XXXX XXXX XXXX XXXX"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fecha de expiración
                        </label>
                        <input
                          type="text"
                          id="fechaExpiracion"
                          name="fechaExpiracion"
                          value={formData.fechaExpiracion || ''}
                          onChange={handleChange}
                          placeholder="MM/AA"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv || ''}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.metodoPago === 'transferencia' && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p className="text-gray-700 dark:text-gray-300">
                      Por favor, realice una transferencia al siguiente número de cuenta:
                    </p>
                    <p className="font-medium mt-2 text-gray-800 dark:text-gray-200">
                      Banco: Banco Nacional<br />
                      Cuenta: 1234567890<br />
                      Titular: Cecomsa SRL
                    </p>
                  </div>
                )}

                {formData.metodoPago === 'efectivo' && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p className="text-gray-700 dark:text-gray-300">
                      Pagarás en efectivo cuando recibas tu pedido.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    'Completar pedido'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.idcarrito} className="flex justify-between">
                  <div className="flex items-start">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-500">{item.nombreproducto?.substring(0, 1)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.nombreproducto}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Cant: {item.cantproducto}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${parseFloat(item.montototal).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${parseFloat(cartTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Impuestos</span>
                <span className="text-gray-900 dark:text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Envío</span>
                <span className="text-gray-900 dark:text-white">$0.00</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${parseFloat(cartTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;