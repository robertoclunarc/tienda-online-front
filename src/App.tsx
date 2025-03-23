import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Páginas
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

// Rutas protegidas
import ProtectedRoute from './components/common/ProtectedRoute';

import AdminRoute from './components/common/AdminRoute';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="bottom-right" autoClose={3000} />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="productos" element={<ProductListPage />} />
              <Route path="productos/categoria/:categoryId" element={<ProductListPage />} />
              <Route path="productos/subcategoria/:subcategoryId" element={<ProductListPage />} />
              <Route path="productos/:productId" element={<ProductDetailPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
              
              {/* Rutas de administrador */}
              <Route 
                path="admin/productos" 
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/productos/nuevo" 
                element={
                  <AdminRoute>
                    <AdminProductFormPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/productos/editar/:productId" 
                element={
                  <AdminRoute>
                    <AdminProductFormPage />
                  </AdminRoute>
                } 
              />
              <Route path="acceso-denegado" element={<AccessDeniedPage />} />
              
              {/* Rutas protegidas */}
              <Route 
                path="checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="perfil" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="perfil/password" 
                element={
                  <ProtectedRoute>
                    <ProfilePage activeTab="password" />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="favoritos" 
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta para 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;