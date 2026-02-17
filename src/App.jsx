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
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700 flex flex-col transition-colors duration-300">

      <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Logo Area */}
            <Link to="/" className="group flex items-center gap-2.5 hover:opacity-80 transition">
              <img src="/logo.png" alt="Diksha" className="w-8 h-8 rounded-full object-cover shadow-md border border-slate-200" />
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none hidden sm:block">Diksha</span>
                <span className="text-[8px] font-semibold tracking-widest text-indigo-600 uppercase hidden sm:block">Design & Print</span>
                {/* Mobile Only Logo Text */}
                <span className="font-bold text-base tracking-tight text-slate-900 leading-none sm:hidden">Diksha</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {/* Navigation Links can go here */}
            </div>

            <div className="hidden md:flex items-center gap-4 sm:gap-6">
              {/* Language Toggle (Desktop) */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title={t('switchLanguage')}
              >
                <div className="w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center text-[8px] overflow-hidden font-bold">
                  {language === 'en' ? 'EN' : 'HI'}
                </div>
                <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>

              {/* Cart Link (Protected) */}
              {token && (
                <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-100 transition-colors" title={t('viewCart')}>
                  <LuShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                  {/* Add Badge here if needed */}
                </Link>
              )}

              <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

              {/* Customer Auth & Profile */}
              {!token ? (
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  {t('login')}
                </Link>
              ) : (
                <>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors focus:outline-none border border-transparent hover:border-slate-200"
                    title={t('myDownloadsOrders')}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <LuUser className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden lg:block">{t('myAccount')}</span>
                  </Link>
                  <button
                    onClick={handleUserLogout}
                    className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors ml-1"
                    title={t('logout')}
                  >
                    <LuLogOut className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Admin Auth */}
              {!isAdmin ? (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
                  title={t('adminAccess')}
                >
                  <LuShieldCheck className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                  >
                    ADMIN <LuRocket className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={handleAdminLogout}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    title={t('adminLogout')}
                  >
                    <LuLogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Language Toggle (Mobile) */}
              <button
                onClick={toggleLanguage}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 mr-2"
                title={t('switchLanguage')}
              >
                {language === 'en' ? 'HI' : 'EN'}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2">
                {isMobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 z-40">
            {/* Mobile Navigation Links */}

            {/* Cart Link (Mobile) */}
            {token && (
              <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600">
                  <LuShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">{t('myCart')}</span>
              </Link>
            )}

            <div className="h-px bg-slate-200 my-2"></div>

            {/* Customer Auth (Mobile) */}
            {!token ? (
              <Link
                to="/login"
                className="flex justify-center w-full px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('loginRegister')}
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
                  <span className="font-medium text-slate-700">{t('myOrders')}</span>
                </Link>

                <button
                  onClick={() => { handleUserLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <LuLogOut className="w-4 h-4" />
                  </div>
                  {t('logout')}
                </button>
              </>
            )}

            {/* Admin Auth (Mobile) */}
            <div className="mt-2 border-t border-slate-200 pt-3">
              {!isAdmin ? (
                <button
                  onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 w-full text-left text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-100 transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  <LuShieldCheck className="w-4 h-4" /> {t('adminAccess')}
                </button>
              ) : (
                <div className="bg-slate-100 rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">{t('adminControls')}</p>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-white border border-slate-200 text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LuRocket className="w-4 h-4" /> {t('adminPanel')}
                  </Link>
                  <button
                    onClick={() => { handleAdminLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full justify-center text-slate-500 hover:text-red-600 p-2 rounded-lg transition-colors text-xs font-medium"
                  >
                    <LuLogOut className="w-3 h-3" /> {t('adminLogout')}
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
        {/* Curved top edge */}
        <div className="absolute -top-3 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-white" style={{ borderRadius: '50% 50% 0 0' }}></div>
        <div className="flex items-center justify-around px-2 py-3 relative">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
          >
            <LuHouse className={`w-5 h-5`} />
            <span className={`text-[10px] font-bold`}>{t('home')}</span>
          </Link>

          {/* Top Deals */}
          <Link
            to="/?sort=price-low"
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100`}
          >
            <div className="relative">
              <LuPercent className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">{t('topDeals')}</span>
          </Link>

          {/* Account */}
          <Link
            to={token ? '/my-orders' : '/login'}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/my-orders' || location.pathname === '/login' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
          >
            <LuUser className={`w-5 h-5`} />
            <span className={`text-[10px] font-bold`}>{t('account')}</span>
          </Link>

          {/* Cart */}
          <Link
            to={token ? '/cart' : '/login'}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/cart' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
          >
            <div className="relative">
              <LuShoppingCart className={`w-5 h-5`} />
            </div>
            <span className={`text-[10px] font-bold`}>{t('cart')}</span>
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
