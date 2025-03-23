import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ProductosService } from '../services/productos.service';
import { CategoriasService } from '../services/categorias.service';
import { Producto, Categoria, Subcategoria } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';

const ProductListPage: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId?: string; subcategoryId?: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('buscar');

  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryId ? parseInt(categoryId) : null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(subcategoryId ? parseInt(subcategoryId) : null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const { addToCart } = useCart();

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriasService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategories();
  }, []);

  // Cargar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }

      try {
        const data = await CategoriasService.getSubcategories(selectedCategory);
        setSubcategories(data);
      } catch (err) {
        console.error('Error al cargar subcategorías:', err);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  // Cargar productos según filtros
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data: Producto[] = [];

        if (searchTerm) {
          // Buscar por término
          data = await ProductosService.search(searchTerm);
        } else if (selectedSubcategory) {
          // Filtrar por subcategoría
          data = await ProductosService.getBySubcategory(selectedSubcategory);
        } else if (selectedCategory) {
          // Filtrar por categoría
          data = await ProductosService.getByCategory(selectedCategory);
        } else {
          // Cargar todos los productos
          data = await ProductosService.getAll();
        }

        // Filtrar por rango de precio
        data = data.filter(product => {
          const price = parseFloat(product.precio);
          return price >= priceRange[0] && price <= priceRange[1];
        });

        // Ordenar productos
        switch (sortBy) {
          case 'price-asc':
            data.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
            break;
          case 'price-desc':
            data.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
            break;
          case 'name-asc':
            data.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
            break;
          case 'name-desc':
            data.sort((a, b) => b.nombreProducto.localeCompare(a.nombreProducto));
            break;
          case 'newest':
          default:
            // Asumiendo que los ID más altos son los más nuevos
            data.sort((a, b) => (b.idProducto ?? 0) - (a.idProducto ?? 0));
            break;
        }

        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar productos');
        console.error('Error al cargar productos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subcategoryId, selectedCategory, selectedSubcategory, searchTerm, sortBy, priceRange]);

  // Resetear los valores al cambiar de categoría desde la URL
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
      setSelectedSubcategory(null);
    }
  }, [categoryId]);

  // Resetear la categoría al cambiar de subcategoría desde la URL
  useEffect(() => {
    if (subcategoryId) {
      setSelectedSubcategory(parseInt(subcategoryId));
    }
  }, [subcategoryId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {searchTerm
          ? `Resultados para "${searchTerm}"`
          : selectedSubcategory
          ? subcategories.find(s => s.idSubCategoria === selectedSubcategory)?.descSubCategoria || 'Productos'
          : selectedCategory
          ? categories.find(c => c.idCategoria === selectedCategory)?.descCategoria || 'Productos'
          : 'Todos los Productos'}
      </h1>

      <div className="flex flex-col md:flex-row">
        {/* Filtros laterales */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">Categorías</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                  className={`text-left w-full py-1 ${!selectedCategory ? 'font-bold text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  Todas las categorías
                </button>
              </li>
              {categories.map(category => (
                <li key={category.idCategoria}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.idCategoria);
                      setSelectedSubcategory(null);
                    }}
                    className={`text-left w-full py-1 ${selectedCategory === category.idCategoria ? 'font-bold text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {category.descCategoria}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedCategory && subcategories.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-bold mb-4">Subcategorías</h2>
              <ul className="space-y-2">
                {subcategories.map(subcategory => (
                  <li key={subcategory.idSubCategoria}>
                    <button
                      onClick={() => setSelectedSubcategory(subcategory.idSubCategoria)}
                      className={`text-left w-full py-1 ${selectedSubcategory === subcategory.idSubCategoria ? 'font-bold text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {subcategory.descSubCategoria}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">Filtro de Precio</h2>
            <div className="px-2">
              <div className="flex justify-between mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="w-full md:w-3/4">
          {/* Ordenamiento y filtros superiores */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <span className="text-gray-600 dark:text-gray-400">Mostrando {products.length} productos</span>
            </div>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-600 dark:text-gray-400">Ordenar por:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="newest">Más recientes</option>
                <option value="price-asc">Precio ascendente</option>
                <option value="price-desc">Precio descendente</option>
                <option value="name-asc">Nombre A-Z</option>
                <option value="name-desc">Nombre Z-A</option>
              </select>
            </div>
          </div>

          {/* Listado de productos */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No se encontraron productos que coincidan con los criterios de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.idProducto} 
                  product={product} 
                  onAddToCart={() => addToCart(product.idProducto!, 1)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;