import React from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../../types';

interface ProductCardProps {
  product: Producto;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="card product-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/productos/${product.idProducto}`}>
        <div className="product-image w-full h-48 flex items-center justify-center bg-gray-100 dark:bg-gray-700 p-4">
          {/* Placeholder para imágenes de productos */}
          <span className="text-2xl text-gray-400">{product.nombreProducto.substring(0, 1)}</span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{product.nombreCategoria || 'Categoría'}</span>
            {product.cantInventario > 0 ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">En stock</span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Agotado</span>
            )}
          </div>
          <h3 className="font-medium text-lg mb-2 text-gray-800 dark:text-white line-clamp-2">{product.nombreProducto}</h3>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg text-gray-900 dark:text-white">${parseFloat(product.precio).toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button 
          onClick={onAddToCart}
          disabled={product.cantInventario <= 0}
          className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
            product.cantInventario > 0 
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