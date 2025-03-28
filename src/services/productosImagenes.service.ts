import api from './api';
import { ProductoImagen } from '../types';

export const ProductosImagenesService = {
  // Obtener todas las imágenes de un producto
  getByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    const response = await api.get(`/productos-imagenes/producto/${productoId}`);
    const data: ProductoImagen[] = response.data;
    return data;
  },

  // Obtener la imagen principal de un producto
  getMainImageByProductId: async (productoId: number): Promise<ProductoImagen | null> => {
    try {
      const response = await api.get(`/productos-imagenes/producto/${productoId}/principal`);
      const data: ProductoImagen  = response.data;
      return data;
    } catch (error) {
      if ((error as any).response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Obtener miniaturas de un producto
  getThumbnailsByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    const response = await api.get(`/productos-imagenes/producto/${productoId}/miniaturas`);
    const data: ProductoImagen[] = response.data;
    return data;
  },

  // Obtener una imagen por su ID
  getById: async (id: number): Promise<ProductoImagen> => {
    const response = await api.get(`/productos-imagenes/${id}`);
    const data: ProductoImagen = response.data;
    return data;
  },

  // Crear una nueva imagen (solo admin)
  create: async (imagen: ProductoImagen): Promise<ProductoImagen> => {
    const response = await api.post('/productos-imagenes', imagen);
    return response.data.imagen;
  },

  // Actualizar una imagen (solo admin)
  update: async (id: number, imagen: Partial<ProductoImagen>): Promise<ProductoImagen> => {
    const response = await api.put(`/productos-imagenes/${id}`, imagen);
    return response.data.imagen;
  },

  // Eliminar una imagen (solo admin)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos-imagenes/${id}`);
  }
};