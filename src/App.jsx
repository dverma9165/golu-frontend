import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt, FaRocket, FaShoppingCart, FaUser } from 'react-icons/fa';
import FileList from './components/FileList';
import AdminLogin from './components/AdminLogin';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';

import { subscribeUser } from './utils/push';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User Auth State
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      subscribeUser('user');
    }
  }, [token]);

  const handleAdminLogin = (password) => {
    setAdminPassword(password);
    setIsAdmin(true);
    setIsLoginOpen(false);
    subscribeUser('admin', password);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
  };

  const handleUserLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <nav className="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-md bg-opacity-95 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg text-white">
                  <FaRocket className="w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-800">Diksha Design and Print</span>
              </Link>

              <div className="flex items-center gap-4">
                {/* Cart Link (Protected) */}
                {token && (
                  <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition relative">
                    <FaShoppingCart className="w-6 h-6" />
                  </Link>
                )}

                {/* Customer Auth */}
                {!token ? (
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">Login</Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleUserLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
                  </div>
                )}

                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                {/* Admin Auth */}
                {!isAdmin ? (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1"
                  >
                    <FaUserShield /> Admin
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin"
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      <FaSignOutAlt />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          {/* Protected Home Route */}
          <Route path="/" element={token ? <FileList /> : <Navigate to="/login" replace />} />

          {/* Protected Product Pages */}
          <Route path="/product/:id" element={token ? <ProductPage token={token} /> : <Navigate to="/login" replace />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Cart */}
          <Route path="/cart" element={token ? <CartPage token={token} /> : <Navigate to="/login" replace />} />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard adminPassword={adminPassword} /> : <Navigate to="/" />}
          />
        </Routes>

        <AdminLogin
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleAdminLogin}
        />
      </div>
    </Router>
  );
}

export default App;
