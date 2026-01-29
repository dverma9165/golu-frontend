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
                <Link to="/" className="text-gray-500 hover:text-gray-900 mb-8 inline-block">&larr; Back to Shop</Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
                    <div className="md:w-1/2 p-4 bg-gray-100 flex items-center justify-center">
                        {product.thumbnail && product.thumbnail.viewLink && (
                            <img
                                src={`https://lh3.googleusercontent.com/d/${product.thumbnail.googleDriveId}`}
                                alt={product.title}
                                className="w-full h-full object-contain rounded-lg"
                            />
                        )}
                    </div>

                    <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
                            <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>

                            <div className="mt-6 border-t pt-4">
                                <p className="text-gray-600">{product.description || "No description."}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {purchaseStatus === 'approved' ? (
                                <div className="bg-green-50 p-4 rounded-lg flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-green-700 font-bold">
                                        <FaCheckCircle /> Purchased & Approved
                                    </div>
                                    <button
                                        onClick={handleDownload}
                                        className="bg-green-600 text-white rounded-xl py-3 font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 w-full"
                                    >
                                        <FaDownload /> Download File
                                    </button>
                                </div>
                            ) : purchaseStatus === 'pending' ? (
                                <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-2 text-yellow-700 font-bold">
                                    <FaLock /> Payment Pending Approval
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="bg-blue-600 text-white rounded-xl py-3 font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={handleAddToCart}
                                        className="bg-orange-500 text-white rounded-xl py-3 font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                                    >
                                        <FaCartPlus /> Add to Cart
                                    </button>
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
