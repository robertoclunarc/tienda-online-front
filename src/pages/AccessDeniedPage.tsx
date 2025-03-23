import React from 'react';
import { Link } from 'react-router-dom';

const AccessDeniedPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">403</h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Acceso Denegado</h2>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        
        <div className="flex justify-center">
          <Link 
            to="/" 
            className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;