
import React, { useState } from 'react';
import { FaTimes, FaCheck, FaSpinner, FaQrcode } from 'react-icons/fa';
import api from '../services/api';

const CheckoutModal = ({ isOpen, onClose, product, totalAmount, cartItems, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [newOrderIds, setNewOrderIds] = useState([]);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');

    // Determine amount to pay
    const baseAmount = totalAmount || (product ? (product.salePrice && product.salePrice < product.price ? product.salePrice : product.price) : 0);
    const amountToPay = discountApplied ? Math.max(1, Math.round(baseAmount * 0.75)) : baseAmount;

    const applyCoupon = () => {
        if (couponCode.trim().toUpperCase() === 'DIKSHA99') {
            setDiscountApplied(true);
            setDiscountMessage('Coupon Applied! 25% Off');
        } else {
            setDiscountApplied(false);
            setDiscountMessage('Invalid Coupon Code');
        }
    };

    if (!isOpen) return null;

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            // 1. Create Order on Backend
            let orderPayload = {};
            if (product) {
                orderPayload = {
                    productId: product._id,
                    couponCode: discountApplied ? 'DIKSHA99' : ''
                };
            } else if (cartItems && cartItems.length > 0) {
                // Send array of IDs
                orderPayload = {
                    cartItems: cartItems.map(item => item.product._id),
                    couponCode: discountApplied ? 'DIKSHA99' : ''
                };
            }

            const { data: order } = await api.post('/api/payment/create-order', orderPayload, {
                headers: { 'x-auth-token': token }
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SE6NSXwMTnifI3", // Fallback if env not set
                amount: order.amount,
                currency: order.currency,
                name: "Digital Store",
                description: "Purchase of Digital Assets",
                image: "https://your-logo-url.com/logo.png", // Optional: Add logo
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
                    try {
                        setLoading(true);
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            customerName: "Razorpay User" // We can ask name if needed, or get from user profile
                        };

                        const verifyRes = await api.post('/api/payment/verify-payment', verifyPayload, {
                            headers: { 'x-auth-token': token }
                        });

                        setNewOrderIds(verifyRes.data.orderIds);
                        setSubmitted(true);
                        if (onSuccess) onSuccess();

                    } catch (verifyErr) {
                        console.error("Verification Failed", verifyErr);
                        setError("Payment Verification Failed. Contact Support.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: "", // Can prefill if we have user info
                    email: "",
                    contact: ""
                },
                notes: {
                    address: "Digital Delivery"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description}`);
                setLoading(false);
            });
            rzp1.open();

        } catch (err) {
            console.error("Payment Init Error:", err);
            setError(err.response?.data?.msg || 'Failed to initiate payment.');
            setLoading(false);
        }
    };

    const handleDownloadAndClose = async () => {
        if (newOrderIds && newOrderIds.length > 0) {
            try {
                // Try to download the first file (Direct Buy scenario)
                const token = localStorage.getItem('token');
                const res = await api.post('/api/files/download',
                    { orderId: newOrderIds[0] },
                    { headers: { 'x-auth-token': token } }
                );
                if (res.data.downloadLink) {
                    window.open(res.data.downloadLink, '_blank');
                }
            } catch (err) {
                console.error("Download trigger failed", err);
            }
        }
        onClose();
    };

    const resetAndClose = () => {
        setSubmitted(false);
        setError('');
        setNewOrderIds([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black bg-opacity-70 transition-opacity"
                onClick={resetAndClose}
            ></div>

            <div
                className="bg-white rounded-xl shadow-2xl z-[60] w-full max-w-md overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 border-b border-blue-400 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FaQrcode className="opacity-80" /> Secure Checkout
                    </h3>
                    <button onClick={resetAndClose} className="text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 p-2 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-8 bg-gray-50">
                    {!submitted ? (
                        <>
                            <div className="mb-0 flex flex-col items-center text-center">
                                {/* Price Display */}
                                <div className="mb-8">
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Total Payable Amount</p>
                                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-1">
                                        <span className="text-2xl text-gray-400 mt-2">₹</span>
                                        {amountToPay}
                                    </h1>
                                    {discountApplied && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                                            🎉 25% Coupon Saving Applied!
                                        </span>
                                    )}
                                </div>

                                {/* Coupon Input */}
                                <div className="w-full mb-6 relative">
                                    <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                                        <input
                                            type="text"
                                            placeholder="Have a coupon code?"
                                            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white outline-none placeholder:text-gray-400 uppercase"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="bg-gray-800 text-white px-6 py-2 text-sm font-bold hover:bg-gray-900 transition-colors"
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                    {discountMessage && (
                                        <p className={`absolute -bottom-6 left-1 text-xs font-bold ${discountApplied ? 'text-green-600' : 'text-red-500'}`}>
                                            {discountMessage}
                                        </p>
                                    )}
                                </div>

                                {/* Product Card */}
                                {product && (
                                    <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-8 text-left hover:border-blue-300 transition-colors">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                                            {product.thumbnail?.viewLink ? (
                                                <img src={`https://lh3.googleusercontent.com/d/${product.thumbnail.googleDriveId}`} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 truncate text-base">{product.title}</p>
                                            <p className="text-sm text-gray-500 truncate">{product.category || 'Digital Asset'}</p>
                                        </div>
                                        <div className="text-right">
                                            {product.salePrice && product.salePrice < product.price ? (
                                                <>
                                                    <p className="font-bold text-gray-900">₹{product.salePrice}</p>
                                                    <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                                                </>
                                            ) : (
                                                <p className="font-bold text-gray-900">₹{product.price}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay ₹{amountToPay} Securely
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5 font-medium tracking-wide uppercase">
                                    <FaQrcode className="text-gray-300" /> 100% Secure Payment via Razorpay
                                </p>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center">
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCheck className="text-green-600 w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h4>
                            <p className="text-gray-500 mb-6">Your order has been approved. You can download your files now.</p>
                            <button onClick={handleDownloadAndClose} className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-bold shadow-lg">
                                Continue & Download
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default CheckoutModal;
