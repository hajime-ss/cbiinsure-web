import React, { useState, useEffect } from 'react';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Moved outside to prevent re-render focus loss
const InputField = ({ icon: Icon, name, type = "text", placeholder, error, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div>
            <div className="relative">
                <Icon className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-zinc-400'}`} size={18} />
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className={`input-sharp pl-10 ${isPassword ? 'pr-10' : 'pr-4'} ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    value={value}
                    onChange={onChange}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

                {error && !isPassword && <AlertCircle className="absolute right-3 top-3 text-red-500" size={18} />}
            </div>
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/');
        });
        return () => unsubscribe();
    }, [navigate]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        // Phone Restriction: Numbers only
        if (field === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [field]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (mode === 'signup') {
            if (!formData.name.trim()) newErrors.name = "Required";
            if (!formData.surname.trim()) newErrors.surname = "Required";
            if (!formData.phone.trim()) newErrors.phone = "Required";

            if (!formData.password) newErrors.password = "Required";
            else if (formData.password.length <= 7) newErrors.password = "Must be > 7 chars";

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }

        if (!formData.email.trim()) newErrors.email = "Required";
        if (mode === 'login' && !formData.password) newErrors.password = "Required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await checkUserAndRedirect(result.user);
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Login Failed: " + error.message);
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            let user;
            if (mode === 'signup') {
                const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                user = cred.user;
                await setDoc(doc(db, "users", user.uid), {
                    name: formData.name,
                    surname: formData.surname,
                    phone: formData.phone,
                    email: formData.email,
                    createdAt: new Date(),
                    carsOwned: 0
                }, { merge: true });
            } else {
                const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                user = cred.user;
            }
            await checkUserAndRedirect(user);
        } catch (error) {
            console.error("Auth Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setErrors({ ...errors, email: 'Email already registered' });
            } else if (error.code === 'auth/wrong-password') {
                setErrors({ ...errors, password: 'Wrong password' });
            } else {
                alert(error.message);
            }
            setIsLoading(false);
        }
    };

    const checkUserAndRedirect = async (user) => {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        // Check for returnUrl
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl');

        if (userDoc.exists()) {
            // Profile exists, go to returnUrl or Home
            navigate(returnUrl || '/');
        } else {
            // New user, must fill profile first
            // Pass returnUrl to profile so it can redirect back after saving
            navigate(returnUrl ? `/profile?returnUrl=${encodeURIComponent(returnUrl)}` : '/profile');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/bg2.jpg')] bg-cover bg-center opacity-30 blur-sm"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-zinc-900/50"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-8 max-w-md w-full relative z-10"
            >
                <div className="text-center mb-8">
                    <img src="/logo.jpg" alt="Logo" className="h-12 w-auto mx-auto rounded-sm mb-4 shadow-lg" />
                    <h1 className="text-2xl font-bold text-white font-thai">
                        {mode === 'login' ? 'ยินดีต้อนรับกลับ / Welcome Back' : 'สร้างบัญชีใหม่ / Create Account'}
                    </h1>
                </div>

                <div className="flex p-1 bg-zinc-800/50 rounded-sm mb-6">
                    <button
                        onClick={() => { setMode('login'); setErrors({}); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-sm transition-all ${mode === 'login' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => { setMode('signup'); setErrors({}); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-sm transition-all ${mode === 'signup' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">

                    <AnimatePresence mode="popLayout">
                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        icon={User}
                                        name="name"
                                        placeholder="Name"
                                        error={errors.name}
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Surname"
                                            className={`input-sharp ${errors.surname ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                            value={formData.surname}
                                            onChange={(e) => handleInputChange('surname', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <InputField
                                    icon={Phone}
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number (08X-XXX-XXXX)"
                                    error={errors.phone}
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <InputField
                        icon={Mail}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        error={errors.email}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />

                    <div>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-3 ${errors.password ? 'text-red-500' : 'text-zinc-400'}`} size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className={`input-sharp pl-10 pr-4 ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                            />
                        </div>
                        {mode === 'signup' && (
                            <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                                {formData.password && formData.password.length <= 7 ? (
                                    <span className="text-red-400">Must be more than 7 characters</span>
                                ) : (
                                    "Secure password (more than 7 chars)"
                                )}
                            </p>
                        )}
                    </div>

                    <AnimatePresence>
                        {mode === 'signup' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <InputField
                                    icon={Lock}
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    error={errors.confirmPassword}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-sm shadow-lg transition-transform hover:scale-[1.02] flex justify-center items-center gap-2 mt-4"
                    >
                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Create Account')}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3 px-6 rounded-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-lg"
                >
                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                    Google Account
                </button>

            </motion.div>
        </div>
    );
};

export default Login;
