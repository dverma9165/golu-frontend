import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTimes, FaDownload, FaSpinner, FaChevronLeft, FaChevronRight, FaStar, FaPen } from 'react-icons/fa';
import ReviewModal from './ReviewModal';
import { useLanguage } from '../context/LanguageContext';

const MyOrdersModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9; // Grid 3x3

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchOrders(1);
        }
    }, [isOpen]);

    const fetchOrders = async (pageNum) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/files/my-orders?page=${pageNum}&limit=${limit}`);
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
            setPage(pageNum);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (orderId, status) => {
        if (status !== 'Approved') return;
        try {
            const res = await api.post('/api/files/download', { orderId });
            if (res.data.downloadLink) {
                window.open(res.data.downloadLink, '_blank');
            } else {
                alert(res.data.msg || "Download not available");
            }
        } catch (err) {
            console.error(err);
            alert("Download failed");
        }
    };

    const openReviewModal = (product) => {
        setSelectedProduct(product);
        setIsReviewOpen(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">My Downloads & Orders</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaTimes className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <FaSpinner className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    ) : (orders || []).length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No orders found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => {
                                const product = order.product;
                                if (!product) return null; // Skip if product deleted

                                // Price Calculations
                                const price = product.price || 0;
                                const salePrice = product.salePrice;
                                const hasDiscount = salePrice && salePrice < price;
                                const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

                                // Thumbnail Logic
                                const thumbnailLink = product.thumbnail?.googleDriveId
                                    ? `${import.meta.env.VITE_DRIVE_URL_PREFIX || 'https://drive.google.com/thumbnail?id='}${product.thumbnail.googleDriveId}`
                                    : null;

                                return (
                                    <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
                                        {/* Product Thumbnail */}
                                        <div className="h-40 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                                            {thumbnailLink ? (
                                                <img
                                                    src={thumbnailLink}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-300">
                                                    <FaStar className="w-8 h-8" />
                                                    <span className="text-xs font-medium">No Preview</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-gray-400 font-mono mb-1 tracking-wider">ORDER #{order._id.slice(-6).toUpperCase()}</p>
                                                    <h3 className="font-bold text-base text-gray-800 line-clamp-1 leading-tight mb-1" title={product.title}>
                                                        {product.title}
                                                    </h3>
                                                    {/* Description */}
                                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-[2.5em]">
                                                        {product.description || "No description available."}
                                                    </p>

                                                    {/* Price & Discount */}
                                                    <div className="flex items-center gap-2 text-sm">
                                                        {hasDiscount ? (
                                                            <>
                                                                <span className="font-bold text-slate-800">₹{salePrice}</span>
                                                                <span className="text-gray-400 line-through text-xs">₹{price}</span>
                                                                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                                                    {discountPercent}% OFF
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-bold text-slate-800">₹{price}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ml-2 ${order.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* Separator */}
                                            <div className="h-px bg-gray-50 my-3"></div>

                                            <div className="mt-auto grid grid-cols-2 gap-3">
                                                {/* Action Buttons */}
                                                {order.status === 'Approved' ? (
                                                    <>
                                                        <button
                                                            onClick={() => openReviewModal(product)}
                                                            className="col-span-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                            title="Write a Review"
                                                        >
                                                            <FaPen className="w-3 h-3" /> Review
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(order._id, order.status)}
                                                            className="col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-indigo-200 shadow-sm"
                                                        >
                                                            <FaDownload className="w-3 h-3" /> Download
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="col-span-2 text-center text-xs text-gray-400 font-medium py-2 bg-gray-50 rounded-lg">
                                                        {order.status === 'Rejected' ? 'Order Rejected' : 'Approval Pending'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2 text-center">
                                                {order.status === 'Approved' && (
                                                    <span className="text-[10px] text-gray-400">Download valid for 72 hours</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer / Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 bg-white flex justify-center items-center gap-4">
                        <button
                            onClick={() => fetchOrders(page - 1)}
                            disabled={page === 1}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-sm font-medium text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => fetchOrders(page + 1)}
                            disabled={page === totalPages}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                productId={selectedProduct?._id}
                productName={selectedProduct?.title}
            />
        </div>
    );
};

export default MyOrdersModal;
