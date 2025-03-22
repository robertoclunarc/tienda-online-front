import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ItemListaDeseos } from '../types';
import api from '../services/api';
import { toast } from 'react-toastify';

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<ItemListaDeseos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lista de deseos
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/listadeseos/usuario/${user.idCuentaUser}`);
        setWishlistItems(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la lista de deseos');
        console.error('Error al cargar la lista de deseos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Manejar añadir al carrito
  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      toast.success('Producto añadido al carrito');
    } catch (err) {
      toast.error('Error al añadir al carrito');
    }
  };

  // Manejar eliminar de la lista de deseos
  const handleRemoveFromWishlist = async (wishlistItemId: number) => {
    try {
      await api.delete(`/listadeseos/${wishlistItemId}`);
      
      // Actualizar la lista de deseos
      setWishlistItems(prev => prev.filter(item => item.idLista !== wishlistItemId));
      
      toast.success('Producto eliminado de la lista de deseos');
    } catch (err) {
      toast.error('Error al eliminar de la lista de deseos');
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
      <h1 className="text-3xl font-bold mb-6">Mi Lista de Deseos</h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Tu lista de deseos está vacía</p>
          <Link 
            to="/productos" 
            className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.idLista} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Link to={`/productos/${item.fkProducto}`}>
                <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">{item.nombreProducto?.substring(0, 1)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-white">{item.nombreProducto}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-bold">${parseFloat(item.precio || '0').toFixed(2)}</p>
                </div>
              </Link>
              <div className="p-4 pt-0 flex flex-col space-y-2">
                <button
                  onClick={() => handleAddToCart(item.fkProducto)}
                  className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Añadir al carrito
                </button>
                <button
                  onClick={() => handleRemoveFromWishlist(item.idLista)}
                  className="w-full py-2 px-4 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;