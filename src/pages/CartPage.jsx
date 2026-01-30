import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const CartPage = ({ token }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchCart();
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
                                    <button className="text-red-400 hover:text-red-600 text-xs font-medium flex items-center gap-1 transition-colors p-2 hover:bg-red-50 rounded-lg">
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

                            <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mb-4">
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
    );
};

export default CartPage;
