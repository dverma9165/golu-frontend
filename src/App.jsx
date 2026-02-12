import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LuUser, LuShoppingCart, LuLogOut, LuShieldCheck, LuRocket, LuMenu, LuX, LuHouse, LuPercent } from 'react-icons/lu';
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
    <Router>
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
    </Router>
  );
}

import MyOrdersPage from './pages/MyOrdersPage';

function AppContent({ token, setToken, isAdmin, setIsAdmin, isLoginOpen, setIsLoginOpen, handleUserLogout, handleAdminLogout, handleAdminLogin, adminPassword }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col transition-colors duration-300">

      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
      </div>

      <nav className="fixed w-full top-0 z-50 glass border-b border-white/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo Area */}
            <Link to="/" className="group flex items-center gap-3 hover:opacity-90 transition">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-200"></div>
                <img src="/logo.png" alt="Diksha" className="relative w-9 h-9 rounded-full object-cover shadow-lg border-2 border-white/50" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-800 leading-none hidden sm:block font-display">Diksha</span>
                <span className="text-[9px] font-bold tracking-widest text-indigo-500 uppercase hidden sm:block">Design & Print</span>
                {/* Mobile Only Logo Text */}
                <span className="font-extrabold text-lg tracking-tight text-slate-800 leading-none sm:hidden font-display">Diksha</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Navigation Links can go here */}
            </div>

            <div className="hidden md:flex items-center gap-4 sm:gap-6">


              {/* Cart Link (Protected) */}
              {token && (
                <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors" title="View Cart">
                  <LuShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                  {/* Add Badge here if needed */}
                </Link>
              )}

              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              {/* Customer Auth & Profile */}
              {!token ? (
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/my-orders"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
                  title="My Downloads & Orders"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <LuUser className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:block">My Account</span>
                </Link>
              )}

              {/* Admin Auth */}
              {!isAdmin ? (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors p-2"
                  title="Admin Access"
                >
                  <LuShieldCheck className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                  >
                    ADMIN <LuRocket className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title="Admin Logout"
                  >
                    <LuLogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2">
                {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-4 animate-fade-in-down z-40">
            {/* Mobile Navigation Links */}

            {/* Cart Link (Mobile) */}
            {token && (
              <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                  <LuShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-700">My Cart</span>
              </Link>
            )}

            <div className="h-px bg-slate-100 my-1"></div>

            {/* Customer Auth (Mobile) */}
            {!token ? (
              <Link
                to="/login"
                className="flex justify-center w-full px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            ) : (
              <>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <LuUser />
                  </div>
                  <span className="font-medium text-slate-700">My Orders</span>
                </Link>

                <button
                  onClick={() => { handleUserLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <LuLogOut className="w-4 h-4" />
                  </div>
                  Logout
                </button>
              </>
            )}

            {/* Admin Auth (Mobile) */}
            <div className="mt-2 border-t border-slate-100 pt-2">
              {!isAdmin ? (
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left text-slate-400 hover:text-indigo-600 p-2 rounded-lg transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <LuShieldCheck className="w-4 h-4" /> Admin Access
                </button>
              ) : (
                <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Controls</p>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-white border border-indigo-100 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-all justify-center shadow-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LuRocket className="w-4 h-4 text-indigo-500" /> Open Admin Panel
                  </Link>
                  <button
                    onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full justify-center text-slate-500 hover:text-red-600 p-2 rounded-lg transition-colors text-xs font-medium"
                  >
                    <LuLogOut className="w-3 h-3" /> Admin Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for Fixed Navbar */}
      <div className="h-16"></div>

      <Routes>
        {/* Public Home Route */}
        <Route path="/" element={<FileList />} />

        {/* Public Product Pages */}
        <Route path="/product/:id" element={<ProductPage token={token} />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Cart */}
        <Route path="/cart" element={token ? <CartPage token={token} /> : <Navigate to="/login" replace />} />

        {/* Protected My Orders */}
        <Route path="/my-orders" element={token ? <MyOrdersPage /> : <Navigate to="/login" replace />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard adminPassword={adminPassword} /> : <Navigate to="/" />}
        />
      </Routes>

      {/* Desktop Footer - hide on mobile since bottom nav is there */}
      <div className="hidden md:block">
        <Footer />
      </div>
      {/* Mobile-only compact footer above bottom nav */}
      <div className="md:hidden pb-20">
        <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
          © {new Date().getFullYear()} Diksha Design & Print
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* Curved top edge */}
        <div className="absolute -top-3 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-white" style={{ borderRadius: '50% 50% 0 0' }}></div>
        <div className="flex items-center justify-around px-2 py-2 relative">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <LuHouse className={`w-5 h-5 ${location.pathname === '/' ? 'text-indigo-600' : ''}`} />
            <span className={`text-[10px] font-bold ${location.pathname === '/' ? 'text-indigo-600' : ''}`}>Home</span>
          </Link>

          {/* Top Deals */}
          <Link
            to="/?sort=price-low"
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 text-gray-400 hover:text-gray-600`}
          >
            <div className="relative">
              <LuPercent className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Top Deals</span>
          </Link>

          {/* Account */}
          <Link
            to={token ? '/my-orders' : '/login'}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/my-orders' || location.pathname === '/login' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <LuUser className={`w-5 h-5 ${location.pathname === '/my-orders' || location.pathname === '/login' ? 'text-indigo-600' : ''}`} />
            <span className={`text-[10px] font-bold ${location.pathname === '/my-orders' || location.pathname === '/login' ? 'text-indigo-600' : ''}`}>Account</span>
          </Link>

          {/* Cart */}
          <Link
            to={token ? '/cart' : '/login'}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 ${location.pathname === '/cart' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <div className="relative">
              <LuShoppingCart className={`w-5 h-5 ${location.pathname === '/cart' ? 'text-indigo-600' : ''}`} />
            </div>
            <span className={`text-[10px] font-bold ${location.pathname === '/cart' ? 'text-indigo-600' : ''}`}>Cart</span>
          </Link>
        </div>
      </div>

      <AdminLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleAdminLogin}
      />
    </div >

  );
}

export default App;
