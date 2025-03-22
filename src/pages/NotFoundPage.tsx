import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Página no encontrada</h2>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300 flex items-center justify-center"
          >
            <i className="fas fa-home mr-2"></i>
            Volver al inicio
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition duration-300 flex items-center justify-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Volver atrás
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            Si crees que esto es un error, por favor{' '}
            <Link to="/contacto" className="text-primary-600 dark:text-primary-400 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;