import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { FaCheck, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { LuTrash2 } from 'react-icons/lu';
import { getDisplayableImageUrl } from '../utils/imageUtils';

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

    // Coupon State
    const [coupons, setCoupons] = useState([]);


    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'coupons') {
            fetchCoupons();
        }
    }, [activeTab, productPage, productSort]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/coupons', {
                headers: { 'x-admin-password': adminPassword }
            });
            setCoupons(res.data);
        } catch (err) {
            console.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

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
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all ${activeTab === 'coupons' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Coupons
                    </button>
                </div>
            </div>

            {activeTab === 'products' && (
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            value={productSort}
                            onChange={(e) => setProductSort(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Products List (Responsive) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {productLoading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    <FaSpinner className="animate-spin" /> Loading products...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No products found.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                                            {product.thumbnail && product.thumbnail.googleDriveId ? (
                                                                <img
                                                                    src={getDisplayableImageUrl(product.thumbnail.googleDriveId)}
                                                                    alt={product.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Link to={`/product/${product._id}`} className="font-bold text-gray-900 hover:text-indigo-600 line-clamp-1">
                                                                {product.title}
                                                            </Link>
                                                            <span className="text-xs text-gray-500">{product.fileType} • {product.version}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        {product.salePrice && product.salePrice < product.price ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-green-600">₹{product.salePrice}</span>
                                                                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-gray-900">
                                                                {product.price === 0 ? <span className="text-green-600">Free</span> : `₹${product.price}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold">
                                                        {product.category || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <LuTrash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden">
                            {productLoading ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="flex justify-center items-center gap-2">
                                        <FaSpinner className="animate-spin" /> Loading...
                                    </div>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No products found.</div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <div key={product._id} className="p-4 flex gap-4">
                                            {/* Thumbnail */}
                                            <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                                {product.thumbnail && product.thumbnail.googleDriveId ? (
                                                    <img
                                                        src={getDisplayableImageUrl(product.thumbnail.googleDriveId)}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <Link to={`/product/${product._id}`} className="font-bold text-gray-900 text-sm hover:text-indigo-600 line-clamp-2">
                                                            {product.title}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition-colors"
                                                        >
                                                            <LuTrash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{product.fileType} • {product.version}</div>
                                                </div>

                                                <div className="flex items-end justify-between mt-2">
                                                    <div>
                                                        {product.salePrice && product.salePrice < product.price ? (
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="font-bold text-green-600">₹{product.salePrice}</span>
                                                                <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-gray-900">
                                                                {product.price === 0 ? <span className="text-green-600">Free</span> : `₹${product.price}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        {product.category || 'Uncat'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {productTotalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setProductPage(p => Math.max(1, p - 1))}
                                disabled={productPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-600 font-medium">
                                Page {productPage} of {productTotalPages}
                            </span>
                            <button
                                onClick={() => setProductPage(p => Math.min(productTotalPages, p + 1))}
                                disabled={productPage === productTotalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'upload' && (
                <div className="max-w-3xl mx-auto">
                    <FileUpload onUploadSuccess={handleUploadComplete} adminPassword={adminPassword} />
                </div>
            )}

            {activeTab === 'coupons' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Add Coupon Form */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Coupon</h2>
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SUMMER50"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase font-mono"
                                    id="newCouponCode"
                                />
                            </div>
                            <div className="w-full sm:w-32">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    placeholder="0-50"
                                    min="0"
                                    max="50"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    id="newCouponPercent"
                                />
                            </div>
                            <button
                                onClick={async () => {
                                    const code = document.getElementById('newCouponCode').value;
                                    const percent = document.getElementById('newCouponPercent').value;
                                    if (!code || !percent) return alert("Please fill all fields");
                                    if (percent > 50) return alert("Discount cannot exceed 50%");

                                    try {
                                        await api.post('/api/coupons', { code, discountPercent: percent }, {
                                            headers: { 'x-admin-password': adminPassword }
                                        });
                                        alert("Coupon Created!");
                                        document.getElementById('newCouponCode').value = '';
                                        document.getElementById('newCouponPercent').value = '';
                                        fetchCoupons(); // Refresh list
                                    } catch (err) {
                                        alert(err.response?.data?.msg || "Failed to create coupon");
                                    }
                                }}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 transition"
                            >
                                Add Coupon
                            </button>
                        </div>
                    </div>

                    {/* Coupons List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Active Coupons</h2>
                            <button onClick={fetchCoupons} className="text-sm text-indigo-600 hover:underline">Refresh</button>
                        </div>

                        {loading ? (
                            <div className="p-8 text-center"><FaSpinner className="animate-spin inline mr-2" /> Loading...</div>
                        ) : coupons.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No coupons found.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {coupons.map(coupon => (
                                    <div key={coupon._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-mono font-bold text-lg text-indigo-700 tracking-wider">{coupon.code}</p>
                                            <p className="text-xs text-gray-500">Created: {new Date(coupon.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:justify-start">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                                {coupon.discountPercent}% OFF
                                            </span>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm("Delete this coupon?")) return;
                                                    try {
                                                        await api.delete(`/api/coupons/${coupon._id}`, {
                                                            headers: { 'x-admin-password': adminPassword }
                                                        });
                                                        setCoupons(coupons.filter(c => c._id !== coupon._id));
                                                    } catch (err) {
                                                        alert("Failed to delete");
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition"
                                                title="Delete Coupon"
                                            >
                                                <LuTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
