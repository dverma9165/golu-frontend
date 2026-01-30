import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaShoppingCart, FaWhatsapp, FaShieldAlt, FaCartPlus, FaDownload, FaLock, FaCheckCircle } from 'react-icons/fa';
import CheckoutModal from '../components/CheckoutModal';

const ProductPage = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Purchase Status State
    const [purchaseStatus, setPurchaseStatus] = useState('none'); // none, pending, approved
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        fetchProduct();
        if (token) checkPurchaseStatus();
    }, [id, token]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/api/files/${id}`);
            setProduct(res.data);
        } catch (err) {
            setError('Product not found.');
        } finally {
            setLoading(false);
        }
    };

    const checkPurchaseStatus = async () => {
        try {
            const res = await api.get('/api/files/my-orders', {
                headers: { 'x-auth-token': token }
            });
            const orders = res.data;
            // Check if current product is in orders
            const match = orders.find(o => o.product && o.product._id === id);

            if (match) {
                setPurchaseStatus(match.status === 'Approved' ? 'approved' : 'pending');
                setOrderId(match._id);
            }
        } catch (err) {
            console.error("Failed to check purchase status");
        }
    };

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/api/auth/cart',
                { productId: product._id },
                { headers: { 'x-auth-token': token } }
            );
            alert("Added to Cart!");
        } catch (err) {
            alert("Failed to add to cart");
        }
    };

    const handleDownload = async () => {
        try {
            const res = await api.post('/api/files/download',
                { orderId },
                { headers: { 'x-auth-token': token } }
            );

            if (res.data.downloadLink) {
                window.open(res.data.downloadLink, '_blank');
            } else {
                alert("Download not ready yet.");
            }
        } catch (err) {
            alert("Download failed.");
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md">
                    &larr; Back to Shop
                </Link>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden md:flex min-h-[600px] border border-slate-100">
                    {/* Left: Image Section */}
                    <div className="md:w-1/2 bg-slate-100 relative group overflow-hidden flex items-center justify-center p-8">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-slate-100 to-slate-200 opacity-70"></div>

                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>

                        {product.thumbnail && product.thumbnail.viewLink ? (
                            <img
                                src={`https://lh3.googleusercontent.com/d/${product.thumbnail.googleDriveId}`}
                                alt={product.title}
                                className="relative z-10 w-full max-h-[500px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                            />
                        ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center text-slate-300">
                                <FaDownload className="w-24 h-24 mb-4 opacity-50" />
                                <span className="text-lg font-medium">No Preview Available</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Details Section */}
                    <div className="md:w-1/2 p-10 lg:p-14 flex flex-col justify-between bg-white relative">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase">
                                    {product.fileType || 'Digital Asset'}
                                </span>
                                <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-lg">
                                    <FaShieldAlt className="w-3 h-3" /> 100% Secure
                                </span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight font-display">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-5xl font-bold text-indigo-600">₹{product.price}</span>
                                <span className="text-slate-400 text-lg line-through decoration-slate-300 decoration-2">₹{Math.round(product.price * 1.5)}</span>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Description</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {product.description || "Top tier design ready for use. High resolution and editable files included."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            {purchaseStatus === 'approved' ? (
                                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-3 text-green-800 font-bold text-lg mb-4">
                                        <FaCheckCircle className="w-6 h-6" />
                                        <span>Purchase Verified</span>
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="w-full bg-green-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FaDownload /> Download Files Now
                                    </button>
                                </div>
                            ) : purchaseStatus === 'pending' ? (
                                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-center gap-3 text-amber-800 font-bold text-lg">
                                    <FaLock className="w-6 h-6 animate-pulse" />
                                    <span>Payment Processing...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={async () => {
                                            if (!token) {
                                                navigate('/login');
                                                return;
                                            }
                                            try {
                                                await api.post('/api/auth/cart',
                                                    { productId: product._id },
                                                    { headers: { 'x-auth-token': token } }
                                                );
                                                navigate('/cart');
                                            } catch (err) {
                                                console.error(err);
                                                // Even if error (e.g. already in cart), go to cart
                                                navigate('/cart');
                                            }
                                        }}
                                        className="bg-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="bg-white text-slate-700 border-2 border-slate-200 rounded-xl py-4 font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaCartPlus /> Add to Cart
                                    </button>
                                </div>
                            )}

                            <div className="text-center mt-6">
                                <p className="text-xs text-slate-400">
                                    Secured by <span className="font-bold text-slate-500">Razorpay</span> • Instant Delivery
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
                onSuccess={() => checkPurchaseStatus()} // Refresh status
            />
        </div>
    );
};

export default ProductPage;
