import api from './api';
import { Modelo } from '../types';

export const ModelosService = {
  // Obtener todas las modelos
  getAll: async (): Promise<Modelo[]> => {
    const response = await api.get('/modelos');
    return response.data;
  },

  // Obtener una modelo por ID
  getById: async (id: number): Promise<Modelo> => {
    const response = await api.get(`/modelos/${id}`);
    return response.data;
  },

};