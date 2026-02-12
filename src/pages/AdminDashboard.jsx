import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { FaCheck, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { LuTrash2 } from 'react-icons/lu';

const AdminDashboard = ({ adminPassword }) => {
    // Orders state removed


    // Product Management State
    const [products, setProducts] = useState([]);
    const [productLoading, setProductLoading] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [productSort, setProductSort] = useState('newest');
    const [productPage, setProductPage] = useState(1);
    const [productTotalPages, setProductTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products');


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


    // fetchOrders function removed


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

    // Order handlers removed


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
        setActiveTab('products');
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-10 gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Link to="/" className="text-xs sm:text-sm text-blue-600 hover:underline">View Site</Link>
                </div>

                <div className="flex bg-gray-200 rounded-lg p-1 font-medium text-xs sm:text-sm w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all ${activeTab === 'products' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all ${activeTab === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
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
                <div className="bg-white rounded-lg shadow overflow-hidden p-3 sm:p-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6 justify-between items-stretch sm:items-center">
                        <div className="w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value);
                                    setProductPage(1);
                                }}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs sm:text-sm font-medium text-gray-700">Sort By:</label>
                            <select
                                value={productSort}
                                onChange={(e) => setProductSort(e.target.value)}
                                className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* ── MOBILE CARDS (sm and below) ── */}
                    <div className="block md:hidden space-y-3">
                        {productLoading ? (
                            <div className="py-10 text-center"><FaSpinner className="animate-spin inline mr-2" /> Loading...</div>
                        ) : products.length === 0 ? (
                            <div className="py-10 text-center text-gray-500">No products found.</div>
                        ) : (
                            products.map(p => (
                                <div key={p._id} className="border border-gray-200 rounded-xl p-3 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        {/* Thumbnail */}
                                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-none">
                                            {p.thumbnail?.viewLink ? (
                                                <img src={`https://lh3.googleusercontent.com/d/${p.thumbnail.googleDriveId}`} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-bold text-gray-900 leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {p.salePrice ? (
                                                    <>
                                                        <span className="font-bold text-green-600 text-sm">₹{p.salePrice}</span>
                                                        <span className="text-gray-400 line-through text-xs">₹{p.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-gray-800 text-sm">₹{p.price}</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-600">{p.fileType}</span>
                                                {p.version && <span className="text-[10px] text-gray-400">v{p.version}</span>}
                                                {p.fontsIncluded === 'Yes' && (
                                                    <span className="text-green-600 font-bold text-[10px] bg-green-50 px-1.5 py-0.5 rounded-full"><FaCheck className="inline mr-0.5 w-2 h-2" />Fonts</span>
                                                )}
                                                {p.rating > 0 ? (
                                                    <span className="text-amber-500 font-bold text-[10px]">★ {p.rating.toFixed(1)}</span>
                                                ) : (
                                                    <span className="text-gray-300 text-[10px]">No rating</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Delete — full-width bottom button */}
                                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                                        <button
                                            onClick={() => handleDeleteProduct(p._id)}
                                            className="flex items-center gap-1.5 text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            <LuTrash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* ── DESKTOP TABLE (md and above) ── */}
                    <div className="hidden md:block overflow-x-auto">
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
                                    <tr><td colSpan="7" className="py-10 text-center"><FaSpinner className="animate-spin inline mr-2" /> Loading...</td></tr>
                                ) : products.length === 0 ? (
                                    <tr><td colSpan="7" className="py-10 text-center text-gray-500">No products found.</td></tr>
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
                    <div className="mt-3 sm:mt-4 flex justify-between items-center bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg">
                        <button
                            disabled={productPage === 1}
                            onClick={() => setProductPage(p => Math.max(1, p - 1))}
                            className={`px-2.5 sm:px-3 py-1 rounded border text-xs sm:text-sm ${productPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            ← Prev
                        </button>
                        <span className="text-xs sm:text-sm text-gray-600">{productPage} / {productTotalPages}</span>
                        <button
                            disabled={productPage === productTotalPages}
                            onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                            className={`px-2.5 sm:px-3 py-1 rounded border text-xs sm:text-sm ${productPage === productTotalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AdminDashboard;
