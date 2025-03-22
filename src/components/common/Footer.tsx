import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a3870] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <div>
                  <p className="font-medium">Santiago</p>
                  <p className="text-sm text-gray-300">809-581-5288</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3"></i>
                <div>
                  <p className="font-medium">Santo Domingo</p>
                  <p className="text-sm text-gray-300">809-532-7026</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="fab fa-whatsapp mt-1 mr-3"></i>
                <div>
                  <p className="font-medium">Whatsapp</p>
                  <p className="text-sm text-gray-300">809-581-5288</p>
                </div>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3"></i>
                <p>info@cecomsa.com</p>
              </li>
            </ul>
          </div>
          
          {/* Columna 2: Tiendas */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tiendas</h3>
            <ul className="space-y-2">
              <li><Link to="/tienda/romulo" className="hover:text-gray-300 transition-colors">Tienda Rómulo</Link></li>
              <li><Link to="/tienda/tiradentes" className="hover:text-gray-300 transition-colors">Tienda Tiradentes</Link></li>
              <li><Link to="/tienda/gurabo" className="hover:text-gray-300 transition-colors">Tienda Gurabo</Link></li>
              <li><Link to="/tienda/portal" className="hover:text-gray-300 transition-colors">Tienda El Portal</Link></li>
              <li><Link to="/edificio-corporativo" className="hover:text-gray-300 transition-colors">Edificio Corporativo</Link></li>
            </ul>
          </div>
          
          {/* Columna 3: Asistencia */}
          <div>
            <h3 className="text-xl font-bold mb-4">Asistencia</h3>
            <ul className="space-y-2">
              <li><Link to="/preguntas-frecuentes" className="hover:text-gray-300 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/garantias" className="hover:text-gray-300 transition-colors">Garantías</Link></li>
              <li><Link to="/devoluciones" className="hover:text-gray-300 transition-colors">Devoluciones</Link></li>
              <li><Link to="/financiamientos" className="hover:text-gray-300 transition-colors">Financiamientos</Link></li>
              <li><Link to="/contacto" className="hover:text-gray-300 transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          {/* Columna 4: Síguenos y Suscripción */}
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4 mb-6">
              <a href="https://facebook.com/cecomsa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="https://twitter.com/cecomsa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="https://instagram.com/cecomsa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://youtube.com/cecomsa" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
            
            <h3 className="text-xl font-bold mb-4">Suscríbete</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 py-2 px-3 bg-white/20 border border-white/30 rounded-l-md focus:outline-none text-white placeholder-white/70"
              />
              <button 
                type="submit"
                className="bg-[#e6007e] text-white py-2 px-4 rounded-r-md hover:bg-[#d10070] transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 text-sm text-gray-300">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="mb-4 md:mb-0">
              <Link to="/terminos" className="hover:text-white mr-4">Términos y condiciones</Link>
              <Link to="/privacidad" className="hover:text-white mr-4">Privacidad</Link>
              <Link to="/politicas" className="hover:text-white">Políticas de transmisión de datos de tarjetas</Link>
            </div>
            <div>
              <Link to="/accesibilidad" className="hover:text-white">Accesibilidad</Link>
            </div>
          </div>
          
          <p>Los precios en tienda pueden ser diferentes y son sujetos a cambios.</p>
          <p className="mt-2">Todos los derechos reservados ©2025 Cecomsa SRL | Diseñado por Creativa.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;