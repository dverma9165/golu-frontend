import React from 'react';
import { FaRocket, FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-200"></div>
                                <img src="/logo.jpg" alt="Diksha Design" className="relative w-12 h-12 rounded-full object-cover border-2 border-slate-700 shadow-lg" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl tracking-tight text-white leading-none font-display">Diksha</span>
                                <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Design & Print</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Elevating your brand with premium digital assets and professional print services. Quality you can trust, designs that inspire...
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.youtube.com/@DikshaDesignPrint" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300">
                                <FaYoutube className="w-3.5 h-3.5" />
                            </a>
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                                <a key={index} href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-display tracking-wide">Shop</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">All Products</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Digital Assets</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Print Services</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-display tracking-wide">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6 font-display tracking-wide">Stay Updated</h4>
                        <p className="text-slate-400 text-xs mb-4">Subscribe to our newsletter for exclusive deals.</p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-800 border-slate-700 text-white text-xs px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Diksha Design & Print. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        Made with <FaHeart className="text-red-500 w-3 h-3 animate-pulse" /> for Creators
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
