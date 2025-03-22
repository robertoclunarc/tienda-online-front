import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductosService } from '../services/productos.service';
import { CategoriasService } from '../services/categorias.service';
import { Producto, Categoria } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Datos del carrusel
  const sliderData = [
    {
      id: 1,
      title: "¡CREA MOMENTOS ÚNICOS VIENDO A SHAKIRA EN VIVO!",
      subtitle: "¿Quieres ganar una ENTRADA DOBLE al concierto de Shakira?",
      description: "Compra una impresora EcoTank o un proyector Epson",
      backgroundImage: "https://www.cecomsa.com/uploads/1/2/3/4/123456789/shakira-banner.jpg",
      buttonText: "Ver productos",
      buttonLink: "/productos/epson"
    },
    {
      id: 2,
      title: "Descubre lo último en tecnología",
      subtitle: "Las mejores ofertas en laptops, tablets y accesorios",
      description: "",
      backgroundImage: "", // Fondo azul generado con CSS
      buttonText: "Ver productos",
      buttonLink: "/productos"
    },
    {
      id: 3,
      title: "Zona GAMER",
      subtitle: "Mejor imagen y audio = más agilidad para tus juegos",
      description: "Tanto si eres jugador ocasional como un experto en gaming...",
      backgroundImage: "", // Fondo púrpura/rosa generado con CSS
      buttonText: "Ver productos",
      buttonLink: "/productos/gaming"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos destacados
        const products = await ProductosService.getFeatured(8);
        setFeaturedProducts(products);
        
        // Cargar categorías
        const categoriesData = await CategoriasService.getAll();
        setCategories(categoriesData);
        
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error al cargar los datos de la página de inicio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Iniciar el autoplay del carrusel
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sliderData.length]);

  // Cambiar slide
  const goToSlide = (index: number) => {
    setActiveSlide(index);
    // Reiniciar el intervalo
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
  };

  // Ir al slide anterior
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  // Ir al siguiente slide
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % sliderData.length);
  };

  const addToWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login
      toast.info('Por favor inicia sesión para añadir productos a tus favoritos');
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    try {
      // Añadir producto a la lista de deseos
      await api.post('/listadeseos', {
        fkCuentaUser: user?.idCuentaUser,
        fkProducto: productId
      });
      
      toast.success('Producto añadido a tu lista de deseos');
    } catch (error) {
      console.error('Error al añadir a lista de deseos:', error);
      
      // Verificar si el error es porque el producto ya está en la lista
      if ((error as any)?.response?.data?.message?.includes('ya está en la lista de deseos')) {
        toast.info('Este producto ya está en tu lista de deseos');
      } else {
        toast.error('No se pudo añadir a la lista de deseos');
      }
    }
  };

  return (
    <>
      {/* Carrusel Principal - Fuera del contenedor para ocupar todo el ancho */}
      <div className="relative overflow-hidden w-full mb-8 h-[400px]">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full w-full" 
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {sliderData.map((slide, index) => (
            <div 
              key={slide.id} 
              className="flex-shrink-0 w-full h-full relative"
            >
              {index === 0 ? (
                // Primer slide con imagen de Shakira
                <div className="w-full h-full bg-[#1a3870] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#1a3870] flex items-center">
                    <div className="container mx-auto px-6 text-white flex justify-between items-center">
                      <div className="w-1/2">
                        <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                        <div className="mb-6">
                          <p className="text-2xl font-bold mb-2">{slide.subtitle}</p>
                          <p className="text-xl">{slide.description}</p>
                        </div>
                        <Link 
                          to={slide.buttonLink} 
                          className="inline-block bg-white text-[#1a3870] font-bold py-2 px-6 rounded-md hover:bg-gray-100 transition duration-300"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                      <div className="w-1/2 flex justify-end">
                        {/* Simulamos la imagen de Shakira con un placeholder */}
                        <div className="w-[450px] h-[380px] bg-blue-300 rounded-full flex items-center justify-center text-blue-800 text-xl font-bold">
                          Imagen de Shakira
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : index === 1 ? (
                // Segundo slide con fondo azul
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center">
                  <div className="container mx-auto px-6 text-white">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl mb-6">{slide.subtitle}</p>
                    <Link 
                      to={slide.buttonLink} 
                      className="inline-block bg-white text-blue-800 font-bold py-2 px-6 rounded-md hover:bg-blue-100 transition duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              ) : (
                // Tercer slide con fondo púrpura/rosa
                <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center">
                  <div className="container mx-auto px-6 text-white">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl mb-6">{slide.subtitle}</p>
                    <Link 
                      to={slide.buttonLink} 
                      className="inline-block bg-white text-purple-800 font-bold py-2 px-6 rounded-md hover:bg-purple-100 transition duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controles del carrusel */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center hover:bg-white/50 transition-all z-10"
          onClick={prevSlide}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 text-white flex items-center justify-center hover:bg-white/50 transition-all z-10"
          onClick={nextSlide}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Indicadores de posición */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === index ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Contenido restante de la página - Dentro del contenedor */}
      <div className="container mx-auto px-4 py-0">
        {/* Categorías Destacadas en forma de iconos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          <Link to="/productos/computadoras" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fas fa-desktop text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Computadoras</span>
          </Link>
          <Link to="/productos/electrodomesticos" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fas fa-blender text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Línea Blanca</span>
          </Link>
          <Link to="/productos/apple" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fab fa-apple text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Apple</span>
          </Link>
          <Link to="/productos/imagenes-sonido" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fas fa-tv text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Imágenes y Sonido</span>
          </Link>
          <Link to="/productos/impresoras" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fas fa-print text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Impresoras</span>
          </Link>
          <Link to="/productos/oficinas" className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <i className="fas fa-briefcase text-4xl text-[#1a3870]"></i>
            </div>
            <span className="text-center font-medium">Oficinas</span>
          </Link>
        </div>

        {/* Banner de Zona Diseñada para Ti */}
        <div className="bg-gray-100 p-8 rounded-lg mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2">Zona diseñada exclusivamente para ti</h2>
              <p className="text-gray-600">Descubre productos personalizados según tus intereses</p>
            </div>
            <Link to="/zona-personalizada" className="bg-[#e6007e] text-white py-2 px-6 rounded-md hover:bg-[#d10070] transition-colors">
              Ver más
            </Link>
          </div>
        </div>

        {/* Banner de Soluciones para Empresas */}
        <div className="bg-[#1a3870] text-white p-8 rounded-lg mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2">Conoce nuestras soluciones de tecnología para empresas</h2>
              <p>Equipamiento y servicios especializados para tu negocio</p>
            </div>
            <Link to="/soluciones-empresas" className="bg-white text-[#1a3870] py-2 px-6 rounded-md hover:bg-gray-100 transition-colors">
              Ver más
            </Link>
          </div>
        </div>

        {/* Productos Destacados - RESTAURADO */}
        {!loading && featuredProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Productos Destacados</h2>
              <Link to="/productos" className="text-[#e6007e] hover:underline">Ver todos</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <div key={product.idProducto} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <Link to={`/productos/${product.idProducto}`}>
                    <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                      <span className="text-4xl text-gray-300">{product.nombreProducto.charAt(0)}</span>
                    </div>
                    <div className="p-4">
                      
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm text-gray-500 mb-2">{product.nombreCategoria}</div>
                        {/* Botón de lista de deseos */}
                        <button 
                            onClick={(e) => {
                              e.preventDefault(); // Prevenir la navegación del Link
                              addToWishlist(product.idProducto);
                            }}
                            className="text-gray-400 hover:text-[#e6007e] transition-colors"
                            aria-label="Añadir a favoritos"
                          >
                            <i className="fas fa-heart"></i>
                        </button>
                      </div>
                      <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.nombreProducto}</h3>
                      <div className="font-bold text-xl text-[#e6007e]">${parseFloat(product.precio).toFixed(2)}</div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button 
                      onClick={() => addToCart(product.idProducto, 1)}
                      className="w-full py-2 bg-[#1a3870] hover:bg-[#15305e] text-white rounded flex items-center justify-center"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sección "Equipa tu oficina" */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Equipa tu oficina</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Mobiliarios</h3>
              <p className="text-gray-600 mb-4">Sillas, escritorios, counter, y más.</p>
              <Link to="/productos/mobiliarios" className="text-[#e6007e] hover:underline flex items-center">
                Ver Productos <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Suministros</h3>
              <p className="text-gray-600 mb-4">Calculadoras, teléfonos, trituradoras...</p>
              <Link to="/productos/suministros" className="text-[#e6007e] hover:underline flex items-center">
                Ver Productos <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Impresoras</h3>
              <p className="text-gray-600 mb-4">Amplia gama de impresoras disponibles.</p>
              <Link to="/productos/impresoras" className="text-[#e6007e] hover:underline flex items-center">
                Ver Productos <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Climatización</h3>
              <p className="text-gray-600 mb-4">Amplia gama de aires acondicionados</p>
              <Link to="/productos/climatizacion" className="text-[#e6007e] hover:underline flex items-center">
                Ver Productos <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Banner financiamiento */}
        <div className="bg-gradient-to-r from-[#1a3870] to-[#2a4a80] text-white p-8 rounded-lg mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2">Cecomsa Financial</h2>
              <p>Tu financiamiento en línea sin intereses</p>
            </div>
            <Link to="/financiamiento" className="bg-white text-[#1a3870] py-2 px-6 rounded-md hover:bg-gray-100 transition-colors">
              Ver Más
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;