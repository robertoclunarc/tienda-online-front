import api from './api';
import { Modelo } from '../types';

export const ModelosService = {
  // Obtener todas las modelos
  getAll: async (): Promise<Modelo[]> => {
    const response = await api.get('/modelos');
    const data: Modelo[] = response.data;
    return data;
  },

  // Obtener una modelo por ID
  getById: async (id: number): Promise<Modelo> => {
    const response = await api.get(`/modelos/${id}`);
    const data: Modelo = response.data;
    return data;
  },

};