import React from 'react';
import { FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = ({ isAdmin, onOpenLogin, onLogout }) => {
    return (
        <footer className="relative bg-[#0A192F] text-slate-300 pt-20 pb-10 mt-auto overflow-hidden border-t border-white/5">
            {/* Subtle Abstract Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid-footer" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-footer)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <img src="/logo.png" alt="Diksha Design" className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#ed3237]/50 transition-colors" />
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl tracking-tight text-white leading-none font-display">Diksha</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-[#ed3237] uppercase">Design & Print</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Premium CDR and PSD marketplace. Professional designs crafted with precision for all your creative and printing needs.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.youtube.com/@DikshaDesignPrint" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#ed3237] hover:text-white transition-all duration-300">
                                <FaYoutube className="w-4 h-4" />
                            </a>
                            {/* {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#ed3237] hover:text-white transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))} */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-black mb-8 font-display uppercase tracking-widest text-sm">Shop</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> All Products</Link></li>
                            <li><Link to="/" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Digital Assets</Link></li>
                            <li><Link to="/" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Print Services</Link></li>
                            <li><Link to="/" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-black mb-8 font-display uppercase tracking-widest text-sm">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Contact Us</Link></li>
                            <li><Link to="/terms" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Terms & Conditions</Link></li>
                            {!isAdmin ? (
                                <li>
                                    <button onClick={onOpenLogin} className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group text-left w-full">
                                        <span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Admin Login
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/admin" className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Admin Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={onLogout} className="hover:text-[#ed3237] transition-colors flex items-center gap-2 group text-left w-full">
                                            <span className="w-1.5 h-1.5 bg-[#ed3237] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span> Admin Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-black mb-8 font-display uppercase tracking-widest text-sm">Stay Updated</h4>
                        <p className="text-slate-400 text-xs mb-6 leading-relaxed">Join our design community for exclusive deals and design tips delivered to your inbox.</p>
                        <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 text-white text-xs px-5 py-4 rounded-xl w-full focus:outline-none focus:border-[#ed3237]/50 transition-all font-bold placeholder:text-slate-600"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-[#ed3237] text-white px-5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                        © {new Date().getFullYear()} Diksha Design & Print. Premium Quality Guaranteed.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            Made with <FaHeart className="text-[#ed3237] w-3 h-3 animate-pulse" /> for India's Designers
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

