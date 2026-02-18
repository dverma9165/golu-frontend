import React from 'react';
import { LuTarget, LuUsers, LuZap, LuSmile } from 'react-icons/lu';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            {/* Hero Section */}
            <div className="relative bg-[#0A192F] py-24 px-4 overflow-hidden">
                {/* Network Style Abstract Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="grid-about" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid-about)" />
                    </svg>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <p className="text-[#ed3237] font-black text-[12px] sm:text-[14px] tracking-[0.3em] uppercase mb-4">
                        Our Story
                    </p>
                    <h1 className="text-white font-extrabold text-4xl sm:text-6xl font-display mb-6 tracking-tight">
                        Elevating Design for the Digital World
                    </h1>
                    <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                        Diksha Design & Print is your premiere destination for high-quality digital assets.
                        We bridge the gap between imagination and reality.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 py-20 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform duration-300">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#ed3237] mb-6">
                            <LuTarget className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 font-display mb-4 uppercase">Our Mission</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Providing designers with the most precise and high-quality CDR & PSD templates to accelerate their creative workflow.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform duration-300">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                            <LuUsers className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 font-display mb-4 uppercase">Our Community</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Serving thousands of creative professionals across the country with reliable and print-ready graphic solutions.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform duration-300">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                            <LuZap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 font-display mb-4 uppercase">Our Passion</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Fueled by a deep passion for graphic design and the technical excellence required for perfect printing.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                            <LuSmile className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 font-display mb-4 uppercase">Customer First</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Ensuring a seamless experience from browsing to downloading, supported by a team that truly cares about your success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
