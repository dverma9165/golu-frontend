import React, { useState } from 'react';
import { FaTimes, FaCheck, FaSpinner, FaQrcode } from 'react-icons/fa';
import api from '../services/api';

const CheckoutModal = ({ isOpen, onClose, product, onSuccess }) => {
    const [customerName, setCustomerName] = useState('');
    const [utr, setUtr] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [orderParams, setOrderParams] = useState(null);
    const [screenshot, setScreenshot] = useState(null);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('productId', product._id);
            formData.append('customerName', customerName);
            formData.append('utr', utr);
            if (screenshot) {
                formData.append('paymentScreenshot', screenshot);
            }

            // Include Token Header
            const res = await api.post('/api/files/order', formData, {
                headers: {
                    'x-auth-token': token
                }
            });

            setSubmitted(true);
            setOrderParams(res.data);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to submit. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setSubmitted(false);
        setCustomerName('');
        setUtr('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
                onClick={resetAndClose}
            ></div>

            <div
                className="bg-white rounded-xl shadow-2xl z-[110] w-full max-w-md overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Checkout</h3>
                    <button onClick={resetAndClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-6">
                    {!submitted ? (
                        <>
                            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                                <span className="text-sm text-blue-800 font-semibold mb-2">Scan & Pay ₹{product.price}</span>
                                <div className="bg-white p-2 rounded shadow flex items-center justify-center">
                                    <img src="/phonepe_qr.png?v=4" alt="QR Code" className="w-48 h-48 object-contain" />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">UPI ID: 7648866779@ybl</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Your Name</label>
                                    <input
                                        type="text" required value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Enter Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">UTR / Ref No.</label>
                                    <input
                                        type="text" required value={utr}
                                        onChange={e => setUtr(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g. 123456789012"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Payment Screenshot (Optional)</label>
                                    <input
                                        type="file" accept="image/*"
                                        onChange={e => setScreenshot(e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 transition"
                                >
                                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Confirm Payment'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheck className="text-green-600 w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Order Submitted!</h4>
                            <p className="text-gray-500 mb-4">Wait for Admin Approval to Download.</p>
                            <button onClick={resetAndClose} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Close</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
