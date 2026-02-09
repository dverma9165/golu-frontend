import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaShoppingCart, FaWhatsapp, FaEye, FaShieldAlt, FaCartPlus, FaDownload, FaLock, FaCheckCircle } from 'react-icons/fa';
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
            // Fetch orders with a high limit to ensure we check all purchases
            const res = await api.get('/api/files/my-orders?limit=1000', {
                headers: { 'x-auth-token': token }
            });

            // Fix: API returns { orders: [], ... } not just []
            const orders = res.data.orders || [];

            // Check if current product is in orders
            const match = orders.find(o => o.product && o.product._id === id);

            if (match) {
                setPurchaseStatus(match.status === 'Approved' ? 'approved' : 'pending');
                setOrderId(match._id);
            }
        } catch (err) {
            console.error("Failed to check purchase status", err);
        }
    };

    const handleAddToCart = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await api.post('/api/auth/cart',
                { productId: product._id }
                // Header is handled by api interceptor, but explicit override is fine too.
                // Removing explicit header to rely on interceptor for consistency if token prop is missing but LS has it.
            );
            alert("Added to Cart!");
        } catch (err) {
            // Show specific error (e.g., "Already in cart")
            alert(err.response?.data?.msg || "Failed to add to cart");
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

    // Review Logic
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await api.post(`/api/files/review/${product._id}`,
                { rating, comment },
                { headers: { 'x-auth-token': token } }
            );

            setReviewSuccess('Review submitted successfully!');
            setComment('');
            setRating(5);
            fetchProduct(); // Refresh reviews
        } catch (err) {
            setReviewError(err.response?.data?.msg || 'Failed to submit review');
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error) return <div className="text-center py-20 text-red-600 font-bold">{error}</div>;
    if (!product) return null;

    return (
        <div className="bg-gray-50 min-h-screen py-1 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

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
                        {/* Product Page Overlays */}
                        {/* Version Banner */}
                        {product.version && (
                            <div className="absolute top-6 left-0 z-20">
                                <div className="bg-white/95 shadow-xl border-r-4 border-red-600 py-2 px-4 rounded-r-lg flex items-center gap-2">
                                    <span className="text-sm font-bold text-red-600 uppercase">
                                        {product.fileType === 'CDR' ? 'CorelDraw' : product.fileType}
                                    </span>
                                    <span className="text-base font-extrabold text-black">
                                        {product.version}
                                    </span>
                                    <span className="text-sm font-bold text-red-600 uppercase">
                                        To All Version
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Fonts Banner */}
                        {product.fontsIncluded === 'Yes' && (
                            <div className="absolute bottom-10 left-0 w-full bg-white/90 backdrop-blur-md py-2 z-20 shadow-lg border-y border-blue-100 flex justify-center items-center">
                                <span className="text-xs font-black text-blue-700 uppercase tracking-widest">
                                    {product.fileType} File With Fonts Fully Editable
                                </span>
                            </div>
                        )}

                        {/* Branding */}
                        <div className="absolute bottom-3 right-4 z-30">
                            <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-1 rounded shadow-sm backdrop-blur-md">
                                Diksha Design and Print
                            </span>
                        </div>
                    </div>

                    {/* Right: Details Section */}
                    <div className="md:w-1/2 p-10 lg:p-14 flex flex-col bg-white relative overflow-y-auto max-h-[800px] scrollbar-hide">
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

                            {/* Rating Summary */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{(product.rating || 0).toFixed(1)}</span>
                                <span className="text-sm text-slate-500">({product.numReviews} Reviews)</span>
                            </div>

                            <div className="flex items-end gap-4 mb-2">
                                <span className="text-5xl font-bold text-indigo-600">₹{product.salePrice || product.price}</span>
                                {product.salePrice && product.salePrice < product.price && (
                                    <div className="flex flex-col mb-1">
                                        <span className="text-slate-400 text-lg line-through decoration-slate-300 decoration-2">₹{product.price}</span>
                                        <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-0.5 rounded">
                                            You Save ₹{product.price - product.salePrice} ({Math.round(((product.price - product.salePrice) / product.price) * 100)}%)
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm mb-8">Inclusive of all taxes</p>


                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-3">Description</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {product.description || "Top tier design ready for use. High resolution and editable files included."}
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <FaCheckCircle />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">Instant Download</span>
                                        <span className="text-xs text-slate-500">Get files immediately</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                        <FaShieldAlt />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-800">Secure Payment</span>
                                        <span className="text-xs text-slate-500">Via Razorpay</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="mt-auto space-y-4">
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
                                        onClick={() => {
                                            if (!token) {
                                                navigate('/login');
                                                return;
                                            }
                                            setIsCheckoutOpen(true);
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

                        {/* Review Form & List */}
                        <div className="mt-12 border-t border-slate-100 pt-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>

                            {/* Reviews List */}
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-6 mb-8">
                                    {product.reviews.map((review, idx) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-slate-800">{review.name}</span>
                                                <span className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-yellow-500 text-sm mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                            <p className="text-slate-600 text-sm">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic mb-8">No reviews yet. Be the first to review!</p>
                            )}

                            {/* Add Review Form */}
                            {purchaseStatus === 'approved' && (
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
                                    {reviewError && <p className="text-red-600 text-sm mb-2">{reviewError}</p>}
                                    {reviewSuccess && <p className="text-green-600 text-sm mb-2">{reviewSuccess}</p>}

                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
                                            <textarea
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                rows="3"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                                placeholder="Share your experience..."
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}
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
