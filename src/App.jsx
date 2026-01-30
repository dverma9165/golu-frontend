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
import Footer from './components/Footer';

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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col">

        {/* Abstract Background Shapes */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
        </div>

        <nav className="fixed w-full top-0 z-50 glass border-b border-white/40 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              {/* Logo Area */}
              <Link to="/" className="group flex items-center gap-3 hover:opacity-90 transition">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-200"></div>
                  <img src="/logo.jpg" alt="Diksha" className="relative w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/50" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-2xl tracking-tight text-slate-800 leading-none hidden sm:block font-display">Diksha</span>
                  <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase hidden sm:block">Design & Print</span>
                  {/* Mobile Only Logo Text */}
                  <span className="font-extrabold text-xl tracking-tight text-slate-800 leading-none sm:hidden font-display">Diksha</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {/* Navigation Links can go here */}
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                {/* Cart Link (Protected) */}
                {token && (
                  <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                    {/* Add Badge here if needed */}
                  </Link>
                )}

                <div className="h-6 sm:h-8 w-px bg-slate-200 mx-1"></div>

                {/* Customer Auth */}
                {!token ? (
                  <Link
                    to="/login"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUserLogout}
                      className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}

                {/* Admin Auth */}
                {!isAdmin ? (
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
                    title="Admin Access"
                  >
                    <FaUserShield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3 bg-indigo-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-indigo-100">
                    <Link
                      to="/admin"
                      className="text-[10px] sm:text-xs font-bold text-indigo-700 hover:underline whitespace-nowrap"
                    >
                      ADMIN PANEL
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="text-indigo-400 hover:text-red-500 transition-colors"
                    >
                      <FaSignOutAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Spacer for Fixed Navbar */}
        <div className="h-24"></div>

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

        <Footer />

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
