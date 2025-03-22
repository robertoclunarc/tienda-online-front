import api from './api';
import { Producto } from '../types';

export const ProductosService = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  // Obtener productos destacados
  getFeatured: async (limit: number = 8) => {
    const response = await api.get(`/productos/destacados?limit=${limit}`);
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: number): Promise<Producto> => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  // Obtener productos por categoría
  getByCategory: async (categoryId: number): Promise<Producto[]> => {
    const response = await api.get(`/productos/categoria/${categoryId}`);
    return response.data;
  },

  // Obtener productos por subcategoría
  getBySubcategory: async (subcategoryId: number): Promise<Producto[]> => {
    const response = await api.get(`/productos/subcategoria/${subcategoryId}`);
    return response.data;
  },

  // Buscar productos
  search: async (term: string): Promise<Producto[]> => {
    const response = await api.get(`/productos/buscar?term=${encodeURIComponent(term)}`);
    return response.data;
  }
};