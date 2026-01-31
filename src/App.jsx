import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaUserShield, FaSignOutAlt, FaRocket, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
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

  // Check Admin Persistence on Load
  useEffect(() => {
    const storedAdminPass = localStorage.getItem('adminPassword');
    const storedAdminTime = localStorage.getItem('adminLoginTime');

    if (storedAdminPass && storedAdminTime) {
      const now = new Date().getTime();
      const loginTime = parseInt(storedAdminTime, 10);
      const hoursPassed = (now - loginTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setIsAdmin(true);
        setAdminPassword(storedAdminPass);
      } else {
        // Expired
        localStorage.removeItem('adminPassword');
        localStorage.removeItem('adminLoginTime');
      }
    }
  }, []);

  const handleAdminLogin = (password) => {
    setAdminPassword(password);
    setIsAdmin(true);
    setIsLoginOpen(false);

    // Persist
    localStorage.setItem('adminPassword', password);
    localStorage.setItem('adminLoginTime', new Date().getTime().toString());

    subscribeUser('admin', password);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminPassword('');
    localStorage.removeItem('adminPassword');
    localStorage.removeItem('adminLoginTime');
  };

  const handleUserLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <AppContent
      token={token}
      setToken={setToken}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
      isLoginOpen={isLoginOpen}
      setIsLoginOpen={setIsLoginOpen}
      handleUserLogout={handleUserLogout}
      handleAdminLogout={handleAdminLogout}
      handleAdminLogin={handleAdminLogin}
      adminPassword={adminPassword}
      setAdminPassword={setAdminPassword}
    />
  );
}

function AppContent({ token, setToken, isAdmin, setIsAdmin, isLoginOpen, setIsLoginOpen, handleUserLogout, handleAdminLogout, handleAdminLogin, adminPassword }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col transition-colors duration-300">

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

              <div className="flex items-center gap-4 sm:gap-6">


                {/* Cart Link (Protected) */}
                {token && (
                  <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors" title="View Cart">
                    <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                    {/* Add Badge here if needed */}
                  </Link>
                )}

                <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                {/* Customer Auth */}
                {!token ? (
                  <Link
                    to="/login"
                    className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleUserLogout}
                      className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg"
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
                    <FaUserShield className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                    >
                      ADMIN PANEL <FaRocket className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                      title="Admin Logout"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2">
                  {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-4 animate-fade-in-down z-40">
              {/* Mobile Navigation Links */}

              {/* Cart Link (Mobile) */}
              {token && (
                <Link to="/cart" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaShoppingCart className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Cart</span>
                </Link>
              )}

              <div className="h-px bg-slate-200 my-1"></div>

              {/* Customer Auth (Mobile) */}
              {!token ? (
                <Link
                  to="/login"
                  className="flex justify-center w-full px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={() => { handleUserLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" /> Logout
                </button>
              )}

              {/* Admin Auth (Mobile) */}
              {!isAdmin ? (
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left text-slate-500 hover:text-indigo-600 p-2 rounded-lg transition-colors"
                >
                  <FaUserShield className="w-5 h-5" /> Admin Access
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ADMIN PANEL <FaRocket className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full text-left text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" /> Admin Logout
                  </button>
                </div>
              )}
            </div>
          )}
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
      </div >
    </Router >
  );
}

export default App;
