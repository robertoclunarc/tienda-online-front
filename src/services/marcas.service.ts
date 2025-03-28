import api from './api';
import { Marca } from '../types';

export const MarcasService = {
  // Obtener todas las marcas
  getAll: async (): Promise<Marca[]> => {
    const response = await api.get('/marcas');
    const data: Marca[] = response.data;
    return data;
  },

  // Obtener una marca por ID
  getById: async (id: number): Promise<Marca> => {
    const response = await api.get(`/marcas/${id}`);
    const data: Marca = response.data;
    return data;
  },

};