import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

import CheckoutModal from '../components/CheckoutModal';

const CartPage = ({ token }) => {
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        if (token) {
            fetchCart();
            fetchOrders();
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/api/auth/cart', {
                headers: { 'x-auth-token': token }
            });
            setCart(res.data.cart || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/files/my-orders', {
                headers: { 'x-auth-token': token }
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error(err);
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
            alert('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.product?.price || 0), 0);
    };

    if (!token) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <FaShoppingCart className="w-16 h-16 text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Please Log In</h2>
            <p className="text-slate-500 mb-8 max-w-md">Sign in to view your cart and continue checkout.</p>
            <Link to="/login" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-lg">
                Log In Now
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

            {/* --- CART SECTION --- */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                        <FaShoppingCart className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 font-display">Your Cart</h1>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                        {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                {cart.length === 0 ? (
                    <div className="glass rounded-3xl p-16 text-center border-dashed border-2 border-slate-200">
                        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaShoppingCart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-3">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8">Looks like you haven't added any design assets yet.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-1">
                            Start Shopping <FaArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3 space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="glass rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:shadow-lg transition-shadow duration-300 group">
                                    {/* Product Image */}
                                    <div className="w-full sm:w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 relative">
                                        {item.product?.thumbnail?.viewLink ? (
                                            <img
                                                src={`https://lh3.googleusercontent.com/d/${item.product.thumbnail.googleDriveId}`}
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
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{item.product?.title || "Unknown Product"}</h3>
                                        <p className="text-sm text-slate-500 mb-2 line-clamp-1">{item.product?.description || "Premium Digital Asset"}</p>
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
                                            Buy Now
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.product?._id)}
                                            className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                        >
                                            <FaTrash className="w-3 h-3" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="glass rounded-3xl p-6 sticky top-28">
                                <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Taxes (Included)</span>
                                        <span>₹0</span>
                                    </div>
                                    <div className="h-px bg-slate-200 my-2"></div>
                                    <div className="flex justify-between text-slate-900 font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                                >
                                    Proceed to Checkout
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <FaShieldAlt className="text-green-500" />
                                    <span>Secure SSL Encrypted Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MY ORDERS / DOWNLOADS SECTION --- */}
            {orders.length > 0 && (
                <div className="mt-16 border-t pt-10">
                    <h2 className="text-2xl font-bold text-slate-900 font-display mb-6">My Downloads & Orders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-mono">Order #{order.utr.slice(-6)}</p>
                                        <h3 className="font-bold text-slate-800 mt-1 line-clamp-1">{order.product?.title || 'Product'}</h3>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                {order.status === 'Approved' ? (
                                    <a
                                        href={order.product?.sourceFile?.downloadLink} target="_blank" rel="noopener noreferrer"
                                        className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                    >
                                        Download File
                                    </a>
                                ) : (
                                    <button disabled className="block w-full text-center bg-slate-100 text-slate-400 py-2 rounded-lg font-semibold cursor-not-allowed">
                                        Download Not Ready
                                    </button>
                                )}
                                <p className="text-center text-[10px] text-slate-400 mt-2">
                                    {order.status === 'Approved' ? 'Valid for 72 hours' : 'Waiting for Admin Approval'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
