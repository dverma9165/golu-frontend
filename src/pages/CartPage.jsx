import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

import CheckoutModal from '../components/CheckoutModal';
import { useLanguage } from '../context/LanguageContext';

const CartPage = ({ token }) => {
    const { t } = useLanguage();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (token) {
            fetchCart(page);
        }
    }, [token, page]);

    const fetchCart = async (pageNum = 1) => {
        try {
            const res = await api.get(`/api/auth/cart?page=${pageNum}&limit=5`, {
                headers: { 'x-auth-token': token }
            });
            setCart(res.data.cart || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalItems(res.data.totalItems || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // State to track single item checkout mode
    const [checkoutItem, setCheckoutItem] = useState(null);

    const handleBuyNow = (product) => {
        setCheckoutItem(product);
        setIsCheckoutOpen(true);
    };

    const handleProceedToCheckout = () => {
        setCheckoutItem(null); // Null means full cart checkout
        setIsCheckoutOpen(true);
    };

    const handleRemoveFromCart = async (productId) => {
        if (!confirm('Remove this item from cart?')) return;
        try {
            const res = await api.delete(`/api/auth/cart/${productId}`, {
                headers: { 'x-auth-token': token }
            });
            setCart(res.data.cart || []);
        } catch (err) {
            console.error(err);
            alert(t('failedRemove'));
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product?.price || 0), 0);
    };

    if (!token) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FaShoppingCart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">{t('pleaseLogin')}</h2>
            <p className="text-slate-500 mb-8 max-w-md text-base">{t('signInToViewCart')}</p>
            <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 hover:shadow-lg transition-all hover:-translate-y-1">
                {t('logInNow')}
            </Link>
        </div>
    );

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* --- PAGINATED CART SECTION --- */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-indigo-100 p-3.5 rounded-xl">
                        <FaShoppingCart className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900">{t('yourCart')}</h1>
                    <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                        {totalItems} {totalItems === 1 ? t('item') : t('items')}
                    </span>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200 smooth-transition">
                        <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaShoppingCart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('cartEmpty')}</h2>
                        <p className="text-slate-500 mb-8 text-base">{t('cartEmptyText')}</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 hover:shadow-lg transition-all hover:-translate-y-1">
                            {t('startShopping')} <FaArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group smooth-transition">
                                    {/* Product Image */}
                                    <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                                        {item.product?.thumbnail?.googleDriveId ? (
                                            <img
                                                src={`${import.meta.env.VITE_DRIVE_URL_PREFIX || 'https://drive.google.com/thumbnail?id='}${item.product.thumbnail.googleDriveId}`}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaShoppingCart />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{item.product?.title || t('unknownProduct')}</h3>
                                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{item.product?.description || t('premiumAsset')}</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                                {item.product?.fileType || 'DIGITAL'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex flex-col items-center sm:items-end gap-3 min-w-[100px]">
                                        <span className="text-xl font-bold text-slate-900">₹{item.product?.price}</span>
                                        <button
                                            onClick={() => handleBuyNow(item.product)}
                                            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-transform hover:-translate-y-0.5 shadow-sm"
                                        >
                                            {t('buyNow')}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.product?._id)}
                                            className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                        >
                                            <FaTrash className="w-3 h-3" /> {t('remove')}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 pt-6">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('previous')}
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {t('page')} {page} {t('of')} {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('next')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-2xl p-7 sticky top-28 border border-slate-200 shadow-lg smooth-transition">
                                <h2 className="text-2xl font-bold text-slate-900 mb-7">{t('orderSummary')}</h2>

                                <div className="space-y-4 mb-7">
                                    <div className="flex justify-between text-slate-600">
                                        <span className="font-medium">{t('subtotal')}</span>
                                        <span className="font-medium">₹{calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span className="font-medium">{t('taxesIncluded')}</span>
                                        <span className="font-medium">₹0</span>
                                    </div>
                                    <div className="h-px bg-slate-200"></div>
                                    <div className="flex justify-between text-slate-900 font-bold text-lg">
                                        <span>{t('total')}</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full bg-indigo-600 text-white rounded-lg py-4 font-bold text-base hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mb-4 smooth-transition"
                                >
                                    {t('proceedCheckout')}
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <FaShieldAlt className="text-emerald-500" />
                                    <span>{t('secureCheckout')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={checkoutItem}
                cartItems={checkoutItem ? null : cart}
                totalAmount={checkoutItem ? checkoutItem.product?.price || checkoutItem.price : calculateTotal()}
                onSuccess={() => {
                    if (!checkoutItem) {
                        setCart([]);
                    }
                    fetchCart();
                    fetchOrders();
                }}
            />
        </div>
    );
};

export default CartPage;
