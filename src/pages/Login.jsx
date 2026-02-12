import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/api/auth/login', { email, password });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setToken(token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
            style={{ top: '56px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Decorative circles */}
            <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 bg-white/10 rounded-full blur-xl"></div>

            <div className="w-full max-w-sm mx-4">
                {/* Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-7 relative overflow-hidden">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-indigo-100">
                            <img src="/logo.png" alt="Diksha" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <h2 className="text-center text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
                    <p className="text-center text-xs text-gray-400 mb-5">Sign in to your account</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="email" required
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                placeholder="Email address"
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type={showPassword ? 'text' : 'password'} required
                                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                placeholder="Password"
                                value={password} onChange={e => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FaSignInAlt className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <Link to="/register" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                            Don't have an account? <span className="font-bold">Sign Up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
