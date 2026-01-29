import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/api/auth/register', { name, email, phone, password });
            setUserId(res.data.userId);
            setStep(2); // Move to OTP step
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/api/auth/verify-otp', { userId, otp });
            localStorage.setItem('token', res.data.token);
            // navigate('/login'); // Or directly to dashboard if token is stored and app state updates
            // For now, let's redirect to login for cleanliness or home if App handles token immediately
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? 'Create an account' : 'Verify Email'}
                    </h2>
                </div>

                {step === 1 && (
                    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    type="text" required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                    value={name} onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="email" required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="tel" required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Phone Number"
                                    value={phone} onChange={e => setPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password" required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                Send OTP
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-blue-600 hover:underline">Already have an account? Sign In</Link>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input
                                    type="text" required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp} onChange={e => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Verify & Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
