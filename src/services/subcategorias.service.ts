import api from './api';
import { Subcategoria } from '../types';

export const SubCategoriasService = {
  // Obtener todas las subcategorías
  getAll: async (): Promise<Subcategoria[]> => {
    const response = await api.get('/subcategorias');
    const data: Subcategoria[] = response.data;
    return data;
  },

  // Obtener una Subcategoría por ID
  getById: async (id: number): Promise<Subcategoria> => {
    const response = await api.get(`/subcategorias/${id}`);
    const data: Subcategoria = response.data;
    return data;
  },

};