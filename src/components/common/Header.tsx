import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Obtener conteo de lista de deseos
  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (isAuthenticated && user?.idcuentauser) {
        try {
          const response = await api.get(`/listadeseos/usuario/${user.idcuentauser}`);
          setWishlistCount(response.data.length || 0);
        } catch (error) {
          console.error('Error al obtener conteo de lista de deseos:', error);
        }
      } else {
        setWishlistCount(0);
      }
    };

    fetchWishlistCount();
  }, [isAuthenticated, user]);

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container') && showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };
  

  return (
    <header>
      {/* Barra superior azul oscuro */}
      <div className="bg-[#1a3870] text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-white/80">Tienda Online</Link>
            <Link to="/soluciones-corporativas" className="text-white hover:text-white/80">Soluciones Corporativas</Link>
          </div>
          <div className="flex space-x-4 items-center">
            {isAuthenticated ? (
              // Contenedor del menú de usuario
              <div className="user-menu-container relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="text-white hover:text-white/80 flex items-center"
                >
                  <span>{user?.nombreuser || 'Usuario'}</span>
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} ml-1`}></i>
                </button>
                
                {/* Menú desplegable de usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                    <div className="py-1">
                      <Link 
                        to="/perfil" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <i className="fas fa-user-edit mr-2"></i>
                        Editar Perfil
                      </Link>
                      <Link 
                        to="/perfil/password" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <i className="fas fa-key mr-2"></i>
                        Cambiar Clave
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-white hover:text-white/80">
                Identificarse
              </Link>
            )}
            <Link to="/contacto" className="text-white hover:text-white/80">Contáctenos</Link>
          </div>
        </div>
      </div>

      {/* Sección del logo, búsqueda y carrito */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <Link to="/" className="mb-4 md:mb-0">
            <div className="flex items-center">
              <svg width="140" height="50" viewBox="0 0 140 50" fill="none">
                {/* Representación simplificada del logo de Cecomsa */}
                <path d="M0 25C0 11.193 11.193 0 25 0H115C128.807 0 140 11.193 140 25C140 38.807 128.807 50 115 50H25C11.193 50 0 38.807 0 25Z" fill="#1a3870"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">cecomsa</text>
              </svg>
            </div>
          </Link>

          {/* Buscador */}
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Buscar Productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#e6007e] text-white px-4 py-2 rounded-r-md hover:bg-[#d10070]"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>

          {/* Iconos de wishlist y carrito */}
          <div className="flex items-center space-x-6">
            {/* Lista de deseos - icono de corazón */}
            <Link to="/favoritos" className="text-gray-800 hover:text-[#e6007e] relative">
              <i className="fas fa-heart text-2xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e6007e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Carrito - icono de carrito */}
            <Link to="/carrito" className="text-gray-800 hover:text-[#e6007e] relative">
              <i className="fas fa-shopping-cart text-2xl"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e6007e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Barra de navegación principal */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center md:justify-start">
            <li className="py-3 px-4">
              <Link to="/productos" className="text-gray-700 hover:text-[#e6007e] font-medium">Ver Todo</Link>
            </li>
            <li className="py-3 px-4 relative group">
              <Link to="/productos/computadoras" className="text-gray-700 hover:text-[#e6007e] font-medium flex items-center">
                Computadoras <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                <div className="py-2">
                  <Link to="/productos/computadoras/desktop" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Desktop</Link>
                  <Link to="/productos/computadoras/laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Laptops</Link>
                  <Link to="/productos/computadoras/all-in-one" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All in One</Link>
                </div>
              </div>
            </li>
            <li className="py-3 px-4 relative group">
              <Link to="/productos/electrodomesticos" className="text-gray-700 hover:text-[#e6007e] font-medium flex items-center">
                Electrodomésticos <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                <div className="py-2">
                  <Link to="/productos/electrodomesticos/aires" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Aires Acondicionados</Link>
                  <Link to="/productos/electrodomesticos/lavadoras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lavadoras</Link>
                  <Link to="/productos/electrodomesticos/refrigeracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Refrigeración</Link>
                </div>
              </div>
            </li>
            <li className="py-3 px-4">
              <Link to="/productos/apple" className="text-gray-700 hover:text-[#e6007e] font-medium">Apple</Link>
            </li>
            <li className="py-3 px-4 relative group">
              <Link to="/productos/imagenes-sonido" className="text-gray-700 hover:text-[#e6007e] font-medium flex items-center">
                Imágenes y Sonido <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                <div className="py-2">
                  <Link to="/productos/imagenes-sonido/televisores" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Televisores</Link>
                  <Link to="/productos/imagenes-sonido/sonido" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sonido</Link>
                  <Link to="/productos/imagenes-sonido/monitores" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Monitores</Link>
                </div>
              </div>
            </li>
            <li className="py-3 px-4 relative group">
              <Link to="/productos/impresoras" className="text-gray-700 hover:text-[#e6007e] font-medium flex items-center">
                Impresoras <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Link>
            </li>
            <li className="py-3 px-4 relative group">
              <Link to="/productos/oficinas" className="text-gray-700 hover:text-[#e6007e] font-medium flex items-center">
                Oficinas <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </Link>
            </li>
            <li className="py-3 px-4">
              <Link to="/ofertas" className="text-gray-700 hover:text-[#e6007e] font-medium">Ofertas 📢</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;