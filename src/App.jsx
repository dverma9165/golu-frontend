import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { LuUser, LuShoppingCart, LuLogOut, LuShieldCheck, LuRocket, LuMenu, LuX, LuHouse, LuPercent } from 'react-icons/lu';
import { useLanguage } from './context/LanguageContext';
import FileList from './components/FileList';
import AdminLogin from './components/AdminLogin';
import ProductPage from './pages/ProductPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import MyOrdersPage from './pages/MyOrdersPage';

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


function AppContent({ token, setToken, isAdmin, setIsAdmin, isLoginOpen, setIsLoginOpen, handleUserLogout, handleAdminLogout, handleAdminLogin, adminPassword }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, language, toggleLanguage } = useLanguage();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col transition-colors duration-300">

      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-indigo-200/30 rounded-full blur-[100px]" />
      </div>

      <nav className="fixed w-full top-0 z-50 bg-slate-900 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo Area */}
            <Link to="/" className="group flex items-center gap-3 hover:opacity-90 transition py-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-200"></div>
                <img src="/logo.png" alt="Diksha" className="relative w-11 h-11 rounded-full object-cover border-2 border-white/20" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 font-display">
                <span className="font-extrabold text-xl tracking-tight text-white leading-none">Diksha</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-indigo-400 uppercase">Design & Print</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 font-display">
              <Link to="/" className={`text-[12px] font-black tracking-widest transition-colors ${location.pathname === '/' ? 'text-[#ed3237]' : 'text-white hover:text-[#ed3237]'}`}>HOME</Link>
              <Link to="/about" className={`text-[12px] font-black tracking-widest transition-colors uppercase ${location.pathname === '/about' ? 'text-[#ed3237]' : 'text-white hover:text-[#ed3237]'}`}>About</Link>
              <Link to="/terms" className={`text-[12px] font-black tracking-widest transition-colors uppercase ${location.pathname === '/terms' ? 'text-[#ed3237]' : 'text-white hover:text-[#ed3237]'}`}>Terms & Conditions</Link>
              <Link to="/contact" className={`text-[12px] font-black tracking-widest transition-colors uppercase ${location.pathname === '/contact' ? 'text-[#ed3237]' : 'text-white hover:text-[#ed3237]'}`}>Contact Us</Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {/* Language Toggle (Desktop) */}
              <button
                onClick={toggleLanguage}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-300 border border-slate-700 font-display hover:bg-slate-700 transition-colors"
              >
                {language === 'en' ? 'HI' : 'EN'}
              </button>

              {/* Login / Register */}
              {!token ? (
                <Link to="/login" className="flex items-center gap-2 text-white hover:text-[#ed3237] transition-colors">
                  <LuUser className="w-5 h-5" />
                  <span className="text-[13px] font-bold">Login / Register</span>
                </Link>
              ) : (
                <Link to="/my-orders" className="flex items-center gap-2 text-white hover:text-[#ed3237] transition-colors">
                  <LuUser className="w-5 h-5" />
                  <span className="text-[13px] font-bold">{t('myAccount')}</span>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative group p-1 transition-colors">
                <LuShoppingCart className="w-6 h-6 text-white group-hover:text-[#ed3237]" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#4CAF50] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">1</span>
              </Link>

              {token && (
                <button onClick={handleUserLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LuLogOut className="w-5 h-5" />
                </button>
              )}


            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleLanguage}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-gray-300 mr-2 border border-slate-700 font-display"
              >
                {language === 'en' ? 'HI' : 'EN'}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none p-2">
                {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl py-6 px-4 flex flex-col gap-4 animate-fade-in-down z-40 font-display">
            <Link to="/" className="text-white font-bold p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            <Link to="/about" className="text-white font-bold p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link>
            <Link to="/terms" className="text-white font-bold p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>TERMS & CONDITIONS</Link>
            <Link to="/contact" className="text-white font-bold p-3 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTACT US</Link>

            <div className="h-px bg-white/10 my-1"></div>

            <Link to={token ? "/cart" : "/login"} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <LuShoppingCart className="w-5 h-5" />
              <span className="font-bold">{t('myCart')}</span>
            </Link>

            {!token ? (
              <Link to="/login" className="flex justify-center w-full px-6 py-4 rounded-xl bg-[#FF8A00] text-white text-sm font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20" onClick={() => setIsMobileMenuOpen(false)}>
                LOGIN / REGISTER
              </Link>
            ) : (
              <button onClick={() => { handleUserLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 w-full text-red-400 p-3 rounded-xl hover:bg-red-500/10 transition-colors">
                <LuLogOut className="w-5 h-5" />
                <span className="font-bold">{t('logout')}</span>
              </button>
            )}

            <div className="h-px bg-white/10 my-1"></div>

            {/* Admin Mobile Links */}
            {!isAdmin ? (
              <button
                onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-left w-full"
              >
                <LuShieldCheck className="w-5 h-5" />
                <span className="font-bold">{t('adminAccess')}</span>
              </button>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LuRocket className="w-5 h-5" />
                  <span className="font-bold">Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left w-full"
                >
                  <LuLogOut className="w-5 h-5" />
                  <span className="font-bold">{t('adminLogout')}</span>
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Spacer for Fixed Navbar */}
      <div className="h-14"></div>

      <Routes>
        <Route path="/" element={<FileList />} />
        <Route path="/product/:id" element={<ProductPage token={token} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={token ? <CartPage token={token} /> : <Navigate to="/login" replace />} />
        <Route path="/my-orders" element={token ? <MyOrdersPage /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard adminPassword={adminPassword} /> : <Navigate to="/" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {/* Footer */}
      <div className="hidden md:block">
        <Footer isAdmin={isAdmin} onOpenLogin={() => setIsLoginOpen(true)} onLogout={handleAdminLogout} />
      </div>
      {/* Mobile Footer Area */}
      <div className="md:hidden pb-24 px-4">
        <div className="text-center py-8 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] font-display">
            Diksha Design & Print
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            © {new Date().getFullYear()} All Rights Reserved.<br />
            Premium CDR & PSD Assets
          </p>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around px-2 py-2 relative">
          <Link to="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location.pathname === '/' ? 'text-[#ed3237]' : 'text-slate-400'}`}>
            <LuHouse className="w-5 h-5" />
            <span className="text-[10px] font-bold font-display uppercase tracking-widest">Home</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location.pathname === '/cart' ? 'text-[#ed3237]' : 'text-slate-400'}`}>
            <div className="relative">
              <LuShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#ed3237] text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">1</span>
            </div>
            <span className="text-[10px] font-bold font-display uppercase tracking-widest">Cart</span>
          </Link>
          <Link to={token ? "/my-orders" : "/login"} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${location.pathname === '/my-orders' ? 'text-[#ed3237]' : 'text-slate-400'}`}>
            <LuUser className="w-5 h-5" />
            <span className="text-[10px] font-bold font-display uppercase tracking-widest">Profile</span>
          </Link>
        </div>
      </div>

      <AdminLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleAdminLogin} />
    </div>
  );
}

export default App;
