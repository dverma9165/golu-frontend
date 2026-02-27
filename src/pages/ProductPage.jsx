import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaShoppingCart, FaWhatsapp, FaEye, FaShieldAlt, FaCartPlus, FaDownload, FaLock, FaCheckCircle, FaGift, FaStar } from 'react-icons/fa';
import CheckoutModal from '../components/CheckoutModal';
import { useLanguage } from '../context/LanguageContext';
import { getDisplayableImageUrl } from '../utils/imageUtils';

const ProductPage = ({ token }) => {
    const { t } = useLanguage();
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
            setError(t('productNotFound'));
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
                if (match.status === 'Approved') setPurchaseStatus('approved');
                else if (match.status === 'Expired') setPurchaseStatus('expired');
                else setPurchaseStatus('pending');
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
        <div className="bg-slate-50 min-h-screen pb-20 selection:bg-indigo-100">
            {/* Header / Breadcrumb - Simple and Clean */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">{t('home')}</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 truncate max-w-[150px] sm:max-w-none">{product.title}</span>
                </nav>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Column: Visuals */}
                    <div className="lg:w-[55%] space-y-6">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative group">
                            {/* Visual Accents */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-colors duration-700"></div>

                            <div className="aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center p-6 sm:p-12 relative z-10">
                                {product.thumbnail?.googleDriveId ? (
                                    <img
                                        src={getDisplayableImageUrl(product.thumbnail.googleDriveId)}
                                        alt={product.title}
                                        className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:scale-[1.02] transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-200">
                                        <FaDownload className="w-20 h-20 mb-4 opacity-20" />
                                        <span className="text-sm font-bold uppercase tracking-widest">{t('noPreview')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Floating Metadata Banners */}
                            <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
                                {product.fileType && (
                                    <div className="bg-white/90 backdrop-blur-md shadow-lg border border-slate-100 px-4 py-2 rounded-2xl flex items-center gap-3 animate-fade-in-up">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                                            {product.fileType === 'CDR' ? 'CorelDraw' : product.fileType} {product.version}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Branding Watermark */}
                            <div className="absolute bottom-6 right-6 z-20 opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm">
                                    © Diksha Design
                                </span>
                            </div>
                        </div>

                        {/* Trust Pillars */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FaCheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 uppercase leading-none">{t('instantDownload')}</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <FaShieldAlt className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 uppercase leading-none">{t('secure100')}</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                    <FaLock className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 uppercase leading-none">{t('encrypted')}</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaShoppingCart className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-900 uppercase leading-none">{t('originalAsset')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Details */}
                    <div className="lg:w-[45%] flex flex-col">
                        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-100 flex-1">
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-2.5 py-1 rounded-full">
                                        {product.category}
                                    </span>
                                    {(product.rating || 0) > 0 && (
                                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                                            <FaStar className="w-2.5 h-2.5 text-amber-500" />
                                            <span className="text-[10px] font-bold text-amber-700">{(product.rating || 0).toFixed(1)} ({product.numReviews})</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-4">
                                    {product.title}
                                </h1>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black text-slate-900">₹{product.salePrice ?? product.price}</span>
                                    {product.salePrice && product.salePrice < product.price && (
                                        <span className="text-lg text-slate-400 line-through decoration-slate-300">₹{product.price}</span>
                                    )}
                                    {product.salePrice && product.salePrice < product.price && (
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-wide">{t('inclusiveTaxes')}</p>
                            </div>

                            <div className="h-[1px] bg-slate-100 w-full mb-8"></div>

                            {/* Main CTA Section */}
                            <div className="space-y-4 mb-8">
                                {(product.price === 0 || product.salePrice === 0) ? (
                                    /* FREE */
                                    <div className="p-1 rounded-3xl bg-slate-50 border border-slate-100">
                                        {token ? (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await api.post('/api/files/download-free', { productId: product._id });
                                                        if (res.data.downloadLink) window.open(res.data.downloadLink, '_blank');
                                                    } catch (err) { alert('Download failed.'); }
                                                }}
                                                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 group"
                                            >
                                                <FaDownload className="text-indigo-400 group-hover:-translate-y-1 transition-transform" />
                                                {t('downloadFree')}
                                            </button>
                                        ) : (
                                            <button onClick={() => navigate('/login')} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                                                <FaLock className="opacity-50" /> {t('loginToDownload')}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    /* PAID */
                                    <>
                                        {purchaseStatus === 'approved' ? (
                                            <div className="p-1 rounded-3xl bg-green-50 border border-green-100">
                                                <button onClick={handleDownload} className="w-full bg-green-600 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3">
                                                    <FaDownload /> {t('downloadNow')}
                                                </button>
                                            </div>
                                        ) : purchaseStatus === 'pending' ? (
                                            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center justify-center gap-3 text-amber-800 font-bold">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                                                {t('paymentProcessing')}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => !token ? navigate('/login') : setIsCheckoutOpen(true)}
                                                    className="bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98]"
                                                >
                                                    {t('buyNow')}
                                                </button>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="bg-white text-slate-700 border-2 border-slate-200 py-5 rounded-2xl font-bold text-lg hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <FaCartPlus className="opacity-30" /> {t('addToCart')}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Secondary Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('productDescription')}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {product.description || t('descriptionFallback')}
                                    </p>
                                </div>

                                {/* Spec Mini-Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('fileFormat')}</p>
                                        <p className="text-xs font-bold text-slate-800">{product.fileType || 'Generic'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t('fontsIncluded')}</p>
                                        <p className="text-xs font-bold text-slate-800">{product.fontsIncluded === 'Yes' ? 'Available' : 'No'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Disclaimers & Reviews */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                    {/* Left & Middle: Disclaimers in Two-Column Grid if Desktop */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs">i</span>
                                {t('importantInformation')}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Disclaimer Cards */}
                                <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-3 text-amber-700">
                                        <FaCheckCircle className="w-5 h-5" />
                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('notePrinters')}</h4>
                                    </div>
                                    <p className="text-xs text-amber-800/80 leading-relaxed">{t('notePrintersText')}</p>
                                </div>

                                <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-3xl">
                                    <div className="flex items-center gap-3 mb-3 text-indigo-700">
                                        <FaShoppingCart className="w-5 h-5" />
                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('pricingNote')}</h4>
                                    </div>
                                    <p className="text-sm font-black text-indigo-900 bg-white inline-block px-3 py-1 rounded-full shadow-sm">₹50 – ₹100</p>
                                    <p className="text-xs text-indigo-800/80 mt-2 leading-relaxed">{t('customizationStart')}</p>
                                </div>

                                <div className="bg-slate-100 border border-slate-200 p-6 rounded-3xl col-span-1 sm:col-span-2">
                                    <div className="flex items-center gap-3 mb-3 text-slate-700">
                                        <FaDownload className="w-5 h-5" />
                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('instantDownloadPolicy')}</h4>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{t('instantDownloadText')}</p>
                                </div>

                                <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl col-span-1 sm:col-span-2">
                                    <div className="flex items-center gap-3 mb-3 text-red-700">
                                        <FaShieldAlt className="w-5 h-5" />
                                        <h4 className="font-bold text-sm uppercase tracking-wide">{t('copyrightTitle')}</h4>
                                    </div>
                                    <p className="text-xs text-red-900/60 leading-relaxed mb-4">{t('copyrightText')}</p>
                                    <div className="bg-white p-4 rounded-2xl flex flex-col gap-2">
                                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{t('printerWarningsHeading')}</p>
                                        <p className="text-[11px] text-slate-600 italic">"{t('printerWarning1')}"</p>
                                        <p className="text-[11px] text-slate-600 italic">"{t('printerWarning2')}"</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Reviews */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs">★</span>
                            {t('customerReviews')}
                        </h2>

                        <div className="space-y-4">
                            {product.reviews && product.reviews.length > 0 ? (
                                product.reviews.map((rev, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-900 uppercase">
                                                    {rev.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{rev.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400">{new Date(rev.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 text-amber-400">
                                                {[...Array(5)].map((_, s) => <FaStar key={s} className={`w-2.5 h-2.5 ${s < rev.rating ? 'fill-current' : 'opacity-20'}`} />)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center">
                                    <p className="text-slate-400 text-sm font-medium">{t('noReviewsYet')}</p>
                                </div>
                            )}

                            {/* Write Review Only for Verified Purchase */}
                            {purchaseStatus === 'approved' && (
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => {/* Scroll or open review form logic */ }}
                                        className="w-full py-4 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100"
                                    >
                                        + {t('writeReview')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Redesigned Modal (Assuming CheckoutModal is responsive internally) */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                product={product}
                onSuccess={() => checkPurchaseStatus()}
            />

            {/* Custom Styles */}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ProductPage;
