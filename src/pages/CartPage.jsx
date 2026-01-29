import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';

const CartPage = ({ token }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) fetchCart();
    }, [token]);

    const fetchCart = async () => {
        try {
            const res = await api.get('/api/auth/cart', {
                headers: { 'x-auth-token': token }
            });
            setCart(res.data.cart || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <div className="text-center py-20"><Link to="/login" className="text-blue-600 underline">Please Log In</Link> to view cart.</div>;
    if (loading) return <div className="text-center py-20">Loading Cart...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><FaShoppingCart /> Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/" className="text-blue-600">Go Shop</Link></p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {item.product?.thumbnail?.viewLink && (
                                                <img
                                                    src={`https://lh3.googleusercontent.com/d/${item.product.thumbnail.googleDriveId}`}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full mr-3 object-cover"
                                                />
                                            )}
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.product?.title || "Unknown Product"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{item.product?.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 bg-gray-50 border-t flex justify-end">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
                            Checkout (Coming Soon)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
