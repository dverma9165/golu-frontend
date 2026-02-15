import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/register', { name, email, phone, password });
            setUserId(res.data.userId);
            setStep(2);
        } catch (err) {
            console.error("Registration Error:", err);
            const errorMsg = err.response?.data?.msg || err.message || t('registrationFailed');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/api/auth/verify-otp', { userId, otp });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.msg || t('verificationFailed'));
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
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-7 relative overflow-hidden">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500"></div>

                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg border-2 border-indigo-100">
                            <img src="/logo.png" alt="Diksha" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step === 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step === 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    </div>

                    <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
                        {step === 1 ? t('createAccount') : t('verifyEmail')}
                    </h2>
                    <p className="text-center text-xs text-gray-400 mb-5">
                        {step === 1 ? t('fillDetails') : t('enterOtp')}
                    </p>

                    {step === 1 && (
                        <form onSubmit={handleRegister} className="space-y-3">
                            {/* Name */}
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text" required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                    placeholder={t('fullName')}
                                    value={name} onChange={e => setName(e.target.value)}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="email" required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                    placeholder={t('emailAddress')}
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="tel" required
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                    placeholder={t('phoneNumber')}
                                    value={phone} onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type={showPassword ? 'text' : 'password'} required
                                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                    placeholder={t('password')}
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
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg shadow-green-200 disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <FaUserPlus className="w-4 h-4" />
                                        {t('sendOtp')}
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-1">
                                <Link to="/login" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                                    {t('alreadyHaveAccount')} <span className="font-bold">{t('signIn')}</span>
                                </Link>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-4">
                            {/* OTP Info */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center">
                                <FaShieldAlt className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                                <p className="text-xs text-indigo-600 font-medium">{t('otpSentTo')} <span className="font-bold">{email}</span></p>
                            </div>

                            {/* OTP Input */}
                            <div className="relative">
                                <FaShieldAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text" required
                                    maxLength="6"
                                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400 text-center tracking-[0.5em] font-bold text-lg"
                                    placeholder="• • • • • •"
                                    value={otp} onChange={e => setOtp(e.target.value)}
                                />
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
                                        <FaShieldAlt className="w-4 h-4" />
                                        {t('verifyLogin')}
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
