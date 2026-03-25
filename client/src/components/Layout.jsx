import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Facebook, Info, Globe, Shield, User, LogOut, Menu, X, MessageCircle } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Footer from './Footer';

const Layout = () => {
    const [lang, setLang] = useState('EN');
    const [bgImage, setBgImage] = useState('/bg1.jpg');
    const [user, setUser] = useState(null);
    const [showGreeting, setShowGreeting] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && !user) {
                // User just logged in
                setShowGreeting(true);
                setTimeout(() => setShowGreeting(false), 5000);
            }
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [user]); // user dependency to track changes

    // Greeting Component (Simple Toast)
    const Greeting = () => (
        <div className={`fixed top-24 right-4 z-[60] bg-white text-zinc-900 px-6 py-4 rounded-sm shadow-2xl border-l-4 border-emerald-500 flex items-center gap-4 transition-all duration-500 ${user ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <User size={20} />
            </div>
            <div>
                <h4 className="font-bold text-sm">Welcome Back!</h4>
                <p className="text-xs text-zinc-500">{user?.displayName || user?.email || "Valued User"}</p>
            </div>
        </div>
    );

    React.useEffect(() => {
        const bgs = ['/bg1.jpg', '/bg2.jpg', '/bg4.jpg'];
        const randomBg = bgs[Math.floor(Math.random() * bgs.length)];
        setBgImage(randomBg);
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const navText = {
        EN: { home: "Home", plans: "Insurance Plans", why: "Why Us", chat: "Chat with us" },
        TH: { home: "หน้าแรก", plans: "แผนประกันภัย", why: "ทำไมต้องเรา", chat: "ปรึกษาเรา" }
    };

    const t = navText[lang];

    return (
        <div className="min-h-screen relative font-sans text-white overflow-x-hidden">
            {/* Global Background - Fixed */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
                style={{ backgroundImage: `url('${bgImage}')` }}
            >
                {/* Overlay - Darker for readability */}
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"></div>
            </div>

            {/* Top Bar Navigation - Liquid Glass Spotlight Effect */}
            <nav
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                onTouchMove={(e) => {
                    if (!e.touches[0]) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const y = e.touches[0].clientY - rect.top;
                    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
                className="fixed top-0 left-0 w-full z-50 group border-b border-white/10"
            >
                {/* Base Dark Glass Tint (Increased Opacity as requested) */}
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl transition-all duration-500"></div>

                {/* Spotlight / Liquid Effect Layer */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
                    }}
                ></div>

                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6 relative z-10">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
                        <div className="bg-white p-1 rounded-sm shadow-sm">
                            <img src="/logo.jpg" alt="Logo" className="h-8 w-auto" />
                        </div>
                        <span className="font-bold tracking-wide text-lg text-white drop-shadow-md">CHONBURI INSURANCE</span>
                    </Link>

                    {/* Menu Items (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide text-white/90">

                        <Link to="/" className="hover:text-amber-400 transition uppercase text-xs tracking-wider font-thai">
                            {t.home}
                        </Link>

                        <Link to="/insurance-info" className="hover:text-amber-400 transition uppercase text-xs tracking-wider flex items-center gap-1 font-thai">
                            {t.plans}
                        </Link>

                        <Link to="/why-us" className="hover:text-amber-400 transition uppercase text-xs tracking-wider font-thai">
                            {t.why}
                        </Link>

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
                                <Link to="/profile" className="flex items-center gap-2 hover:text-emerald-400 transition group">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/30" />
                                    ) : (
                                        <div className="bg-emerald-600 p-1.5 rounded-full">
                                            <User size={16} />
                                        </div>
                                    )}
                                    <span className="hidden md:block max-w-[100px] truncate text-xs font-normal opacity-80 group-hover:opacity-100">
                                        {user.displayName?.split(' ')[0]}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-white/50 hover:text-red-400 transition"
                                    title="Sign Out"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="ml-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                Login / Sign Up
                            </Link>
                        )}

                        {/* External */}
                        <a
                            href="https://www.facebook.com/chonburiins/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition"
                        >
                            <Facebook size={18} />
                        </a>

                        {/* Language Toggle - Sharp */}
                        <div className="flex border border-white/20 rounded-sm overflow-hidden">
                            <button
                                onClick={() => setLang('EN')}
                                className={`px-2 py-1 text-[10px] font-bold transition ${lang === 'EN' ? 'bg-white text-emerald-900' : 'text-white hover:bg-white/10'}`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => setLang('TH')}
                                className={`px-2 py-1 text-[10px] font-bold transition ${lang === 'TH' ? 'bg-white text-emerald-900' : 'text-white hover:bg-white/10'}`}
                            >
                                TH
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-16 left-0 w-full bg-zinc-900/95 backdrop-blur-xl border-b border-white/10 z-40 overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col p-4 space-y-2">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.home}</Link>
                            <Link to="/insurance-info" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.plans}</Link>
                            <Link to="/claims" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.claims}</Link>
                            <Link to="/why-us" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.why}</Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.about}</Link>
                            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-4 rounded-md text-lg font-bold text-white font-thai active:bg-white/10 transition-colors touch-manipulation">{t.contact}</Link>

                            <div className="pt-3 border-t border-white/10 flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                                                    <User size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-bold">{user.displayName || "User"}</p>
                                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-emerald-400 text-sm">View Profile</Link>
                                            </div>
                                        </div>
                                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-400 text-sm font-bold flex items-center gap-2">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-black py-3 rounded-sm text-center font-bold uppercase tracking-wider">
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div className="flex flex-wrap gap-2 w-full">
                                    {[
                                        { code: 'TH', label: '🇹🇭 TH' },
                                        { code: 'EN', label: '🇬🇧 EN' },
                                        { code: 'ZH', label: '🇨🇳 ZH' }
                                    ].map((l) => (
                                        <button 
                                            key={l.code}
                                            onClick={() => setLang(l.code)} 
                                            className={`flex-1 min-w-[30%] px-2 py-2.5 rounded-sm font-bold text-sm ${lang === l.code ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="pt-20 flex-grow">
                <Outlet context={{ lang }} />
            </div>

            <Footer lang={lang} />

            {/* Floating LINE Button */}
            <a
                href="https://line.me/ti/p/~@chonburiins"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[45] bg-[#06C755]/90 backdrop-blur-md hover:bg-[#05b64c] text-white p-3 md:p-4 rounded-full shadow-[0_8px_30px_rgba(6,199,85,0.4)] hover:scale-105 transition-all duration-300 group flex items-center justify-center border border-white/20"
            >
                <MessageCircle size={24} className="md:w-7 md:h-7" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] group-hover:ml-2.5 transition-all duration-500 ease-out whitespace-nowrap font-bold font-thai text-sm md:text-base opacity-0 group-hover:opacity-100 hidden sm:block">
                    {t.chat}
                </span>
            </a>
            {/* Greeting Toast */}
            <AnimatePresence>
                {user && showGreeting && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="fixed top-24 right-4 z-[60] bg-white text-zinc-900 px-6 py-4 rounded-sm shadow-xl border-l-4 border-emerald-500 flex items-center gap-4"
                    >
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                                {user.displayName ? user.displayName[0] : <User size={20} />}
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-sm font-thai">ยินดีต้อนรับ / Welcome</h4>
                            <p className="text-xs text-zinc-500 font-bold max-w-[150px] truncate">{user.displayName || user.email}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;
