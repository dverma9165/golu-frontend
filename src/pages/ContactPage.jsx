import React, { useState } from 'react';
import { LuPhone, LuMail, LuMapPin, LuSend, LuClock } from 'react-icons/lu';

const ContactPage = () => {
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white font-inter">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Contact Info - Left Side */}
                <div className="bg-[#0A192F] text-white p-12 sm:p-20 flex flex-col justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ed3237]/10 rounded-full -ml-40 -mb-40"></div>

                    <div className="relative z-10">
                        <p className="text-[#ed3237] font-black text-[12px] uppercase tracking-[0.1em] mb-4">
संपर्क करें</p>
                        <h1 className="text-4xl sm:text-6xl font-black font-display mb-10 leading-tight uppercase">Let's build <br /><span className="text-[#ed3237]">Something</span> <br /> Great.</h1>

                        <div className="space-y-8 max-w-md">
                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ed3237] transition-all duration-300">
                                    <LuPhone className="w-6 h-6 text-[#ed3237] group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Call Us</h4>
                                    <p className="text-xl font-bold font-display">+91 999 000 0000</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ed3237] transition-all duration-300">
                                    <LuMail className="w-6 h-6 text-[#ed3237] group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Email Us</h4>
                                    <p className="text-xl font-bold font-display">hello@dikshastudio.com</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ed3237] transition-all duration-300">
                                    <LuMapPin className="w-6 h-6 text-[#ed3237] group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Visit Us</h4>
                                    <p className="text-xl font-bold font-display leading-tight">123 Design Street, Creative Hub, <br />New Delhi - 110001</p>
                                </div>
                            </div>

                            <div className="flex gap-6 items-start group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#ed3237] transition-all duration-300">
                                    <LuClock className="w-6 h-6 text-[#ed3237] group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Hours</h4>
                                    <p className="text-xl font-bold font-display">Mon - Sat: 10AM - 8PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form - Right Side */}
                <div className="bg-white p-12 sm:p-20 flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
                        <h2 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight mb-8">Send a Message</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Your Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ed3237]/20 focus:border-[#ed3237] transition-all font-bold text-slate-900"
                                        placeholder="Enter name"
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Email Address</label>
                                    <input
                                        type="email" required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ed3237]/20 focus:border-[#ed3237] transition-all font-bold text-slate-900"
                                        placeholder="Email@example.com"
                                        value={formState.email}
                                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Subject</label>
                                <input
                                    type="text" required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ed3237]/20 focus:border-[#ed3237] transition-all font-bold text-slate-900"
                                    placeholder="How can we help?"
                                    value={formState.subject}
                                    onChange={e => setFormState({ ...formState, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Message</label>
                                <textarea
                                    required rows="5"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#ed3237]/20 focus:border-[#ed3237] transition-all font-bold text-slate-900 resize-none"
                                    placeholder="Tell us about your project..."
                                    value={formState.message}
                                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white rounded-full py-5 px-10 font-black text-xs tracking-[0.2em] uppercase hover:bg-[#ed3237] transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-200 flex items-center justify-center gap-3 group"
                            >
                                Send Message
                                <LuSend className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
