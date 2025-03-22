import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ItemCarrito } from '../types';
import api from '../services/api';
import { toast } from 'react-toastify';

interface CartContextProps {
  cartItems: ItemCarrito[];
  loading: boolean;
  error: string | null;
  addToCart: (productoId: number, cantidad: number) => Promise<void>;
  updateCartItem: (carritoId: number, cantidad: number) => Promise<void>;
  removeFromCart: (carritoId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: string;
  cartCount: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState<string>('0.00');
  const [cartCount, setCartCount] = useState<number>(0);

  // Usuario actual (en una aplicación real, vendría de un contexto de autenticación)
  const usuarioId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId') || '0') : 1;

  // Cargar carrito al iniciar
  useEffect(() => {
    fetchCart();
  }, []);

  // Función para obtener el carrito del usuario
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/carrito/usuario/${usuarioId}`);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || '0.00');
      setCartCount(response.data.cantidadItems || 0);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el carrito');
      console.error('Error al cargar el carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Añadir producto al carrito
  const addToCart = async (productoId: number, cantidad: number) => {
    try {
      setLoading(true);
      await api.post('/carrito', {
        fkProducto: productoId,
        cantProducto: cantidad,
        fkCuentaUser: usuarioId,
        estatusCarrito: 'ACTIVO'
      });
      
      await fetchCart();
      toast.success('Producto añadido al carrito');
    } catch (err) {
      setError('Error al añadir producto al carrito');
      toast.error('Error al añadir producto al carrito');
      console.error('Error al añadir al carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un producto en el carrito
  const updateCartItem = async (carritoId: number, cantidad: number) => {
    try {
      setLoading(true);
      await api.put(`/carrito/${carritoId}`, { cantidad });
      await fetchCart();
      toast.success('Carrito actualizado');
    } catch (err) {
      setError('Error al actualizar el carrito');
      toast.error('Error al actualizar el carrito');
      console.error('Error al actualizar el carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un producto del carrito
  const removeFromCart = async (carritoId: number) => {
    try {
      setLoading(true);
      await api.delete(`/carrito/${carritoId}`);
      await fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (err) {
      setError('Error al eliminar producto del carrito');
      toast.error('Error al eliminar producto del carrito');
      console.error('Error al eliminar del carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      await api.delete(`/carrito/usuario/${usuarioId}/clear`);
      setCartItems([]);
      setCartTotal('0.00');
      setCartCount(0);
      toast.success('Carrito limpiado');
    } catch (err) {
      setError('Error al limpiar el carrito');
      toast.error('Error al limpiar el carrito');
      console.error('Error al limpiar el carrito:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};