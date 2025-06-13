import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MenuPage from './pages/MenuPage';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import CustomPizzaBuilder from './pages/CustomPizzaBuilder';
import Cart from './pages/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PizzaDetail from './pages/PizzaDetail';
import LandingPage from './pages/LandingPage';
import OrderTracking from './components/user/OrderTracking';
import OrderManagement from './components/admin/OrderManagement';
import InventoryDashboard from './components/admin/InventoryDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PaymentSuccess from './pages/PaymentSuccess';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <div className="container">
                <AuthRoutes />
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

const AuthRoutes = () => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/pizza/:id" element={<PizzaDetail pizzas={[]} />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* Unauthenticated Home */}
      {!isLoggedIn && <Route path="/" element={<LandingPage />} />}

      {/* User Routes */}
      {isLoggedIn && user?.role === 'user' && (
        <>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customize" element={<CustomPizzaBuilder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/orders" element={<OrderTracking />} />
        </>
      )}

      {/* Admin Routes */}
      {isLoggedIn && user?.role === 'admin' && (
        <>
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/inventory" element={<InventoryDashboard />} />
        </>
      )}

      {/* Redirect logged-in users from login/register/admin login */}
      {isLoggedIn && (
        <>
          <Route path="/login" element={<Navigate to={user?.role === 'admin' ? '/admin_dashboard' : '/dashboard'} replace />} />
          <Route path="/register" element={<Navigate to={user?.role === 'admin' ? '/admin_dashboard' : '/dashboard'} replace />} />
          <Route path="/admin" element={<Navigate to="/admin_dashboard" replace />} />
        </>
      )}

      {/* Redirect guests away from protected routes */}
      {!isLoggedIn && (
        <>
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
          <Route path="/customize" element={<Navigate to="/login" replace />} />
          <Route path="/cart" element={<Navigate to="/login" replace />} />
          <Route path="/menu" element={<Navigate to="/login" replace />} />
          <Route path="/orders" element={<Navigate to="/login" replace />} />
          <Route path="/admin_dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/orders" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/inventory" element={<Navigate to="/admin" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
