import api from './api';
import { Categoria, Subcategoria } from '../types';

export const CategoriasService = {
  // Obtener todas las categorías
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get('/categorias');
    const data: Categoria[] = response.data;
    return data;
  },

  // Obtener una categoría por ID
  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get(`/categorias/${id}`);
    const data: Categoria = response.data;
    return data;
  },

  // Obtener subcategorías de una categoría
  getSubcategories: async (categoryId: number): Promise<Subcategoria[]> => {
    const response = await api.get(`/categorias/${categoryId}/subcategorias`);
    const data: Subcategoria[] = response.data;
    return data;
  }
};