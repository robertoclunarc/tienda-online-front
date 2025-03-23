import api from './api';
import { Marca } from '../types';

export const MarcasService = {
  // Obtener todas las marcas
  getAll: async (): Promise<Marca[]> => {
    const response = await api.get('/marcas');
    return response.data;
  },

  // Obtener una marca por ID
  getById: async (id: number): Promise<Marca> => {
    const response = await api.get(`/marcas/${id}`);
    return response.data;
  },

};