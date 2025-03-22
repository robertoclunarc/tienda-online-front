import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, loading, error, updateCartItem, removeFromCart, clearCart, cartTotal } = useCart();

  // Manejar cambio de cantidad
  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItem(cartItemId, newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrito de compras</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link 
            to="/productos" 
            className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listado de productos en el carrito */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <tr key={item.idCarrito}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">{item.nombreProducto?.substring(0, 1)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.nombreProducto}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {item.nombreCategoria}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${parseFloat(item.precio || '0').toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleQuantityChange(item.idCarrito, item.cantProducto - 1)}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md"
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </button>
                          <input 
                            type="number" 
                            min="1"
                            value={item.cantProducto}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val >= 1) {
                                handleQuantityChange(item.idCarrito, val);
                              }
                            }}
                            className="w-12 px-2 py-1 text-center border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          <button 
                            onClick={() => handleQuantityChange(item.idCarrito, item.cantProducto + 1)}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${parseFloat(item.montoTotal).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => removeFromCart(item.idCarrito)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between">
              <Link 
                to="/productos" 
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition duration-300"
              >
                Continuar comprando
              </Link>
              <button 
                onClick={clearCart}
                className="py-2 px-4 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition duration-300"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Resumen de la orden</h2>
              
              <div className="space-y-3 mb-6">
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
              
              <Link
                to="/checkout"
                className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center justify-center"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;