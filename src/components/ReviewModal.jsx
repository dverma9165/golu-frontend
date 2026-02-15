import React, { useState } from 'react';
import api from '../services/api';
import { FaStar, FaTimes, FaSpinner } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const ReviewModal = ({ isOpen, onClose, productId, productName, initialRating }) => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(initialRating || 5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post(`/api/files/review/${productId}`, { rating, comment });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setComment('');
                setRating(5);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || t('failedSubmitReview'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaTimes className="text-gray-500" />
                </button>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaStar className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{t('reviewSubmitted')}</h3>
                        <p className="text-gray-500 mt-2">{t('thankYouFeedback')}</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t('rateAndReview')}</h3>
                        <p className="text-sm text-gray-500 mb-6">{t('shareExperienceWith')} <span className="font-semibold text-gray-700">{productName}</span></p>

                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <FaStar
                                            className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('yourReview')}</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
                                    placeholder={t('reviewPlaceholder')}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : t('submitReviewBtn')}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;
