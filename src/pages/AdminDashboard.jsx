import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { FaCheck, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const AdminDashboard = ({ adminPassword }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'upload'

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/files/orders', {
                headers: { 'x-admin-password': adminPassword }
            });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (orderId) => {
        try {
            await axios.post('http://localhost:5000/api/files/approve',
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

                <div className="flex bg-gray-200 rounded-lg p-1 mt-4 md:mt-0">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'orders' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Manage Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'upload' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Upload Product
                    </button>
                </div>
            </div>

            {activeTab === 'upload' ? (
                <div className="max-w-3xl mx-auto">
                    <FileUpload onUploadSuccess={handleUploadComplete} adminPassword={adminPassword} />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.customerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                            <div>{order.utr}</div>
                                            {order.paymentScreenshot && order.paymentScreenshot.viewLink && (
                                                <a
                                                    href={order.paymentScreenshot.viewLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                                >
                                                    View Screenshot
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {order.product ? order.product.title : <span className="text-red-400">Deleted</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                            ₹{order.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleApprove(order._id)}
                                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!loading && orders.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-10 text-gray-500">No orders found.</td></tr>
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
