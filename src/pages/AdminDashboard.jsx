import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { FaCheck, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const AdminDashboard = ({ adminPassword }) => {
    const [orders, setOrders] = useState([]);

    // Product Management State
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [productSort, setProductSort] = useState('newest');
    const [productPage, setProductPage] = useState(1);
    const [productTotalPages, setProductTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'upload', 'products'

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        }
    }, [activeTab, productPage, productSort]); // Search is handled by explicit button or debounce (using simple button here for now or effect on strict match)

    // Debounce search effect
    useEffect(() => {
        if (activeTab === 'products') {
            const timer = setTimeout(() => fetchProducts(), 500);
            return () => clearTimeout(timer);
        }
    }, [productSearch]);


    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/files/orders', {
                headers: { 'x-admin-password': adminPassword }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        setProductLoading(true);
        try {
            const res = await api.get(`/api/files/all-products?page=${productPage}&limit=10&search=${productSearch}&sort=${productSort}`, {
                headers: { 'x-admin-password': adminPassword }
            });
            setProducts(res.data.files);
            setProductTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setProductLoading(false);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            await api.post('/api/files/approve',
                { orderId },
                { headers: { 'x-admin-password': adminPassword } }
            );
            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Approved' } : o));
            alert("Order Approved!");
        } catch (err) {
            console.error(err);
            alert("Failed to approve");
        }
    };

    const handleReject = async (orderId) => {
        if (!confirm("Are you sure you want to reject this order?")) return;
        try {
            await api.post('/api/files/reject',
                { orderId },
                { headers: { 'x-admin-password': adminPassword } }
            );
            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Rejected' } : o));
        } catch (err) {
            console.error(err);
            alert("Failed to reject");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        try {
            await api.delete(`/api/files/${productId}`, {
                headers: { 'x-admin-password': adminPassword }
            });
            // Update local state
            setProducts(products.filter(p => p._id !== productId));
            alert("Product Deleted!");
        } catch (err) {
            console.error("Failed to delete product", err);
            alert("Failed to delete product");
        }
    };

    const handleUploadComplete = () => {
        alert("Product Uploaded Successfully!");
        setActiveTab('orders'); // Switch back to see if logic needed, or just stay
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link to="/" className="text-sm text-blue-600 hover:underline">View Site</Link>
                </div>

                <div className="flex bg-gray-200 rounded-lg p-1 mt-4 md:mt-0 font-medium text-sm">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-md transition-all ${activeTab === 'orders' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Manage Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 rounded-md transition-all ${activeTab === 'products' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2 rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Upload Product
                    </button>
                </div>
            </div>

            {activeTab === 'upload' && (
                <div className="max-w-3xl mx-auto">
                    <FileUpload onUploadSuccess={handleUploadComplete} adminPassword={adminPassword} />
                </div>
            )}

            {activeTab === 'products' && (
                <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
                        <div className="w-full md:w-1/3">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    setProductPage(1); // Reset to page 1 on search
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Sort By:</label>
                            <select
                                value={productSort}
                                onChange={(e) => setProductSort(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type / Ver</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fonts Included</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {productLoading ? (
                                    <tr><td colSpan="6" className="py-10 text-center"><FaSpinner className="animate-spin inline mr-2" /> Loading...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="6" className="py-10 text-center text-gray-500">No products found.</td></tr>
                                ) : (
                                    products.map(p => (
                                        <tr key={p._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                                                    {p.thumbnail?.viewLink ? (
                                                        <img src={`https://lh3.googleusercontent.com/d/${p.thumbnail.googleDriveId}`} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {p.salePrice ? (
                                                    <div>
                                                        <span className="font-bold text-green-600">₹{p.salePrice}</span>
                                                        <span className="text-gray-400 line-through text-xs ml-2">₹{p.price}</span>
                                                    </div>
                                                ) : (
                                                    <span>₹{p.price}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{p.fileType}</span>
                                                {p.version && <span className="ml-2 text-xs text-gray-400">v{p.version}</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {p.fontsIncluded === 'Yes' ? (
                                                    <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full"><FaCheck className="inline mr-1" /> Yes</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-500 font-bold">
                                                {p.rating > 0 ? `★ ${p.rating.toFixed(1)}` : <span className="text-gray-300 font-normal">No ratings</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteProduct(p._id)}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
                        <button
                            disabled={productPage === 1}
                            onClick={() => setProductPage(p => Math.max(1, p - 1))}
                            className={`px-3 py-1 rounded border ${productPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {productPage} of {productTotalPages}</span>
                        <button
                            disabled={productPage === productTotalPages}
                            onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                            className={`px-3 py-1 rounded border ${productPage === productTotalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 hidden md:table-header-group">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">UTR</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 block md:table-row-group">
                                {loading ? (
                                    <tr className="block md:table-row"><td colSpan="7" className="text-center py-4 block md:table-cell">Loading...</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 block md:table-row border-b md:border-none mb-4 md:mb-0 shadow-sm md:shadow-none p-4 md:p-0">
                                        <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500 block md:table-cell flex justify-between md:block">
                                            <span className="font-bold text-gray-700 md:hidden">Date:</span>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900 block md:table-cell flex justify-between md:block">
                                            <span className="font-bold text-gray-700 md:hidden">Customer:</span>
                                            {order.customerName}
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 text-sm font-mono text-gray-600 max-w-[200px] block md:table-cell flex justify-between md:block items-center">
                                            <span className="font-bold text-gray-700 md:hidden mr-2">UTR:</span>
                                            <div className="text-right md:text-left">
                                                <div className="truncate md:w-32" title={order.utr}>{order.utr}</div>
                                                {order.paymentScreenshot && order.paymentScreenshot.viewLink && (
                                                    <a
                                                        href={order.paymentScreenshot.viewLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-500 hover:underline flex items-center justify-end md:justify-start gap-1 mt-1"
                                                    >
                                                        View Screenshot
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 text-sm text-gray-600 max-w-[200px] block md:table-cell flex justify-between md:block">
                                            <span className="font-bold text-gray-700 md:hidden">Product:</span>
                                            <div className="truncate md:w-48 text-right md:text-left" title={order.product ? order.product.title : 'Deleted'}>
                                                {order.product ? order.product.title : <span className="text-red-400">Deleted</span>}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900 font-bold block md:table-cell flex justify-between md:block">
                                            <span className="font-bold text-gray-700 md:hidden">Amount:</span>
                                            ₹{order.amount}
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap block md:table-cell flex justify-between md:block">
                                            <span className="font-bold text-gray-700 md:hidden">Status:</span>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Approved' ? 'bg-green-100 text-green-800' : order.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium block md:table-cell flex justify-between md:block items-center">
                                            <span className="font-bold text-gray-700 md:hidden">Action:</span>
                                            <div className="flex justify-end md:justify-start">
                                                {order.status === 'Pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(order._id)}
                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(order._id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && orders.length === 0 && (
                                    <tr className="block md:table-row"><td colSpan="7" className="text-center py-10 text-gray-500 block md:table-cell">No orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
