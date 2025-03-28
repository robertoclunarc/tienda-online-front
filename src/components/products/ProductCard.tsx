import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../../types';
import { ProductosImagenesService } from '../../services/productosImagenes.service';

interface ProductCardProps {
  product: Producto;
  onAddToCart: () => void;
  onAddToWishlist?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToWishlist }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar la imagen del producto
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const mainImage = await ProductosImagenesService.getMainImageByProductId(product.idproducto || 0);
        if (mainImage) {
          setImageUrl(mainImage.imagen);
        }
      } catch (error) {
        console.error('Error al cargar la imagen del producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [product.idproducto]);
  return (
    <div className="card product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/productos/${product.idproducto}`}>
      <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
          {loading ? (
            <div className="spinner"></div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.nombreproducto} 
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-4xl text-gray-300">{product.nombreproducto.charAt(0)}</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{product.nombrecategoria || 'Categoría'}</span>
            {product.cantinventario > 0 ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">En stock</span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Agotado</span>
            )}
          </div>
          <h3 className="font-medium text-lg mb-2 text-gray-800 dark:text-white line-clamp-2">{product.nombreproducto}</h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900 dark:text-white">${parseFloat(product.precio).toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button 
          onClick={onAddToCart}
          disabled={product.cantinventario <= 0}
          className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
            product.cantinventario > 0 
              ? 'bg-primary-600 hover:bg-primary-700' 
              : 'bg-gray-400 cursor-not-allowed'
          } transition duration-300`}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;