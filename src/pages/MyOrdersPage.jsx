import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaDownload, FaSpinner, FaChevronLeft, FaChevronRight, FaPen, FaFileAlt, FaFilePdf, FaFileExcel, FaFileImage } from 'react-icons/fa';
import ReviewModal from '../components/ReviewModal';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9; // Grid 3x3

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchOrders(1);
    }, []);

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

    // Helper for non-image thumbnails
    const getFileIcon = (mimeType) => {
        if (!mimeType) return <FaFileAlt className="text-gray-300 w-12 h-12" />;
        if (mimeType.includes('pdf')) return <FaFilePdf className="text-red-400 w-12 h-12" />;
        if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FaFileExcel className="text-green-400 w-12 h-12" />;
        if (mimeType.includes('image') || mimeType.includes('photoshop')) return <FaFileImage className="text-purple-400 w-12 h-12" />;
        return <FaFileAlt className="text-gray-300 w-12 h-12" />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 font-display">My Downloads & Orders</h1>

            <div className="min-h-[500px]">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <FaSpinner className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                ) : (orders || []).length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No orders found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {orders.map((order) => {
                            const product = order.product;
                            if (!product) return null;

                            // Price Calculations
                            const price = product.price || 0;
                            const salePrice = product.salePrice;
                            const hasDiscount = salePrice && salePrice < price;
                            const discountPercent = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

                            // Thumbnail Logic
                            const thumbnailLink = product.thumbnail?.viewLink
                                ? `https://lh3.googleusercontent.com/d/${product.thumbnail.googleDriveId}`
                                : null;

                            return (
                                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                                    {/* Thumbnail Section */}
                                    <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                        {thumbnailLink ? (
                                            <img
                                                src={thumbnailLink}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                {getFileIcon(product.thumbnail?.mimeType || product.mimeType)}
                                                <span className="text-xs text-gray-400 font-medium">No Preview</span>
                                            </div>
                                        )}

                                        {/* Status Badge Over Image */}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${order.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[10px] text-gray-400 font-mono tracking-wider">ORDER #{order._id.slice(-6).toUpperCase()}</p>
                                        </div>

                                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors" title={product.title}>
                                            {product.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                            {product.description || "No description available."}
                                        </p>

                                        {/* Price */}
                                        <div className="mt-auto mb-6 flex items-center gap-3">
                                            {hasDiscount ? (
                                                <>
                                                    <span className="font-extrabold text-xl text-slate-900">₹{salePrice}</span>
                                                    <span className="text-sm text-gray-400 line-through">₹{price}</span>
                                                    <span className="text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-md">
                                                        {discountPercent}% OFF
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-extrabold text-xl text-slate-900">₹{price}</span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {order.status === 'Approved' ? (
                                                <>
                                                    <button
                                                        onClick={() => openReviewModal(product)}
                                                        className="col-span-1 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 text-slate-600 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <FaPen className="w-3 h-3" /> Review
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(order._id, order.status)}
                                                        className="col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                                                    >
                                                        <FaDownload className="w-3 h-3" /> Download
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="col-span-2 text-center text-xs text-gray-400 font-medium py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                    {order.status === 'Rejected' ? 'Order Rejected' : 'Approval Pending'}
                                                </div>
                                            )}
                                        </div>

                                        {order.status === 'Approved' && (
                                            <p className="text-[10px] text-center text-gray-400 mt-3">Link expires in 72 hours</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                        onClick={() => fetchOrders(page - 1)}
                        disabled={page === 1}
                        className="p-3 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FaChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => fetchOrders(page + 1)}
                        disabled={page === totalPages}
                        className="p-3 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FaChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            )}

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                productId={selectedProduct?._id}
                productName={selectedProduct?.title}
            />
        </div>
    );
};

export default MyOrdersPage;
