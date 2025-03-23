import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductosService } from '../services/productos.service';
import { ProductosImagenesService } from '../services/productosImagenes.service';
import { Producto, ProductoImagen } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/products/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Producto | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Producto[]>([]);
  const [mainImage, setMainImage] = useState<ProductoImagen | null>(null);
  const [thumbnails, setThumbnails] = useState<ProductoImagen[]>([]);
  const [allImages, setAllImages] = useState<ProductoImagen[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Cargar detalles del producto y sus imágenes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const data = await ProductosService.getById(parseInt(productId));
        setProduct(data);
        
        // Cargar todas las imágenes del producto
        const images = await ProductosImagenesService.getByProductId(parseInt(productId));
        setAllImages(images);
        
        // Buscar la imagen principal
        const mainImg = images.find(img => img.principal === 1) || (images.length > 0 ? images[0] : null);
        setMainImage(mainImg);
        
        if (mainImg) {
          setSelectedImage(mainImg.imagen);
        }
        
        // Filtrar miniaturas
        const thumbs = images.filter(img => img.miniatura === 1);
        setThumbnails(thumbs);        
        
        setError(null);
        
        // Resetear la cantidad
        setQuantity(1);
      } catch (err) {
        setError('Error al cargar los detalles del producto');
        console.error('Error al cargar el producto:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Cargar productos relacionados
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.fkSubCategoria) return;
      
      try {
        const data = await ProductosService.getBySubcategory(product.fkSubCategoria);
        // Filtrar el producto actual y limitar a 4 productos
        const filtered = data
          .filter(p => p.idProducto !== product.idProducto)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // Manejar cambio de imagen seleccionada
  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };  

  // Manejar añadir al carrito
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      if (product.idProducto !== undefined) {
        await addToCart(product.idProducto, quantity);
      } else {
        toast.error('El producto no tiene un identificador válido');
      }
      toast.success(`${quantity} ${quantity > 1 ? 'unidades' : 'unidad'} de ${product.nombreProducto} añadidas al carrito`);
    } catch (err) {
      toast.error('Error al añadir al carrito');
    }
  };

  // Incrementar cantidad
  const incrementQuantity = () => {
    if (product && quantity < product.cantInventario) {
      setQuantity(prev => prev + 1);
    }
  };

  // Decrementar cantidad
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Producto no encontrado'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Migas de pan */}
      <div className="mb-6">
        <nav className="text-sm breadcrumbs">
          <ul className="flex space-x-2">
            <li><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-600">Inicio</Link></li>
            <li className="text-gray-500 dark:text-gray-400">/</li>
            {product.nombreCategoria && (
              <>
                <li>
                  <Link to={`/productos/categoria/${product.fkSubCategoria}`} className="text-gray-500 dark:text-gray-400 hover:text-primary-600">
                    {product.nombreCategoria}
                  </Link>
                </li>
                <li className="text-gray-500 dark:text-gray-400">/</li>
              </>
            )}
            <li className="text-gray-700 dark:text-gray-300">{product.nombreProducto}</li>
          </ul>
        </nav>
      </div>

      {/* Detalles del producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Imágenes del producto */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Imagen principal */}
          <div className="mb-4 h-80 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.nombreProducto} 
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-6xl text-gray-400">{product.nombreProducto.substring(0, 1)}</span>
            )}
          </div>

          {/* Miniaturas */}
          {allImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {allImages.map(img => (
                <button 
                  key={img.idImagen} 
                  onClick={() => handleImageSelect(img.imagen)}
                  className={`w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 ${
                    selectedImage === img.imagen ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img.imagen} 
                    alt={img.descImagen || product.nombreProducto} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{product.nombreProducto}</h1>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">Marca:</span>
              <span className="text-gray-800 dark:text-gray-200">{product.nombreMarca || 'No especificada'}</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">Modelo:</span>
              <span className="text-gray-800 dark:text-gray-200">{product.nombreModelo || 'No especificado'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">Categoría:</span>
              <span className="text-gray-800 dark:text-gray-200">{product.nombreCategoria || 'No especificada'}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              {product.descProducto || 'Sin descripción disponible para este producto.'}
            </p>
          </div>
          
          <div className="flex items-center mb-6">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              ${parseFloat(product.precio).toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {product.cantInventario > 0 ? `${product.cantInventario} disponibles` : 'Agotado'}
            </span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md"
              >
                <i className="fas fa-minus"></i>
              </button>
              <input 
                type="number" 
                min="1" 
                max={product.cantInventario}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 0 && val <= product.cantInventario) {
                    setQuantity(val);
                  }
                }}
                className="w-16 px-3 py-2 text-center border-t border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= product.cantInventario}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={product.cantInventario <= 0}
              className={`flex-1 py-3 px-6 rounded-md text-white flex items-center justify-center ${
                product.cantInventario > 0 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              } transition duration-300`}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Añadir al carrito
            </button>
            <button className="flex-1 py-3 px-6 border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-md flex items-center justify-center">
              <i className="fas fa-heart mr-2"></i>
              Añadir a favoritos
            </button>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard 
                key={relatedProduct.idProducto} 
                product={relatedProduct} 
                onAddToCart={() => addToCart(relatedProduct.idProducto || 0, 1)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;