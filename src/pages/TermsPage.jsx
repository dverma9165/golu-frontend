import React from 'react';
import { LuShieldCheck, LuScale, LuLock, LuFileText } from 'react-icons/lu';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-inter py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 mb-6 group">
                        <LuScale className="w-10 h-10 text-[#ed3237] group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display mb-4 uppercase tracking-tighter">
                        Terms & <span className="text-[#ed3237]">Conditions</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Last updated: February 18, 2026</p>
                </div>

                {/* Content Tabs/Sections */}
                <div className="space-y-8">
                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <LuFileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 font-display uppercase">1. Usage Rights</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            By downloading any CDR or PSD material from Diksha Design & Print, you are granted a non-exclusive license to use the designs for both personal and commercial projects.
                        </p>
                        <ul className="list-disc list-inside text-slate-500 space-y-2 text-sm ml-4">
                            <li>Modification for client work is allowed.</li>
                            <li>Reselling the raw source files is strictly prohibited.</li>
                            <li>Unauthorized distribution on other design marketplaces will lead to legal action.</li>
                        </ul>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#ed3237]">
                                <LuShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 font-display uppercase">2. Payments & Refunds</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            All digital product purchases are final. Due to the nature of digital downloads, we do not offer refunds once the file has been accessed or downloaded.
                            Please ensure your software compatibility (CorelDraw/Photoshop version) before completing the purchase.
                        </p>
                    </section>

                    <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <LuLock className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 font-display uppercase">3. Privacy Policy</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            We respect your privacy. Your personal information and payment data are encrypted and secured. We do not share your contact details with third-party advertisers.
                            Information collected is used solely for order processing and account management.
                        </p>
                    </section>

                    <section className="bg-[#0A192F] p-8 rounded-3xl shadow-2xl shadow-slate-900/20 text-white">
                        <h2 className="text-xl font-black font-display uppercase mb-4 tracking-wider">Need Clarification?</h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            If you have any questions regarding these terms, please contact our support team before proceeding with any transaction.
                        </p>
                        <div className="flex justify-start">
                            <a href="/contact" className="px-6 py-3 bg-[#ed3237] text-white rounded-full font-bold text-xs tracking-widest hover:bg-red-700 transition-colors uppercase">
                                Contact Support
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
