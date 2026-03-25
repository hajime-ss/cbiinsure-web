import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Clock, CheckCircle, Search, Mail, Settings as SettingsIcon, Save, KeyRound, ChevronRight, LogOut, Loader2, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        SENT: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        FAILED: "bg-red-500/10 text-red-500 border-red-500/20",
        PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 w-max ${styles[status] || styles.PENDING}`}>
            {status === 'PENDING' && <Clock size={12} />}
            {status === 'SENT' && <CheckCircle size={12} />}
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    // --- Auth State ---
    const [apiKey, setApiKey] = useState(localStorage.getItem('adminApiKey') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminApiKey'));
    const [authStep, setAuthStep] = useState(1); // 1 = Email, 2 = OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    // --- Dashboard State ---
    const [view, setView] = useState('dashboard');
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Settings State ---
    const [config, setConfig] = useState({
        sender_email: '',
        receiver_email: '',
        email_subject: '',
        email_body_template: ''
    });
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState('');

    // --- Data Fetching (Only if Authenticated) ---
    useEffect(() => {
        if (!isAuthenticated) return;

        // 1. Firebase Listener for Monitoring
        const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(data);
            setStats({
                total: data.length,
                pending: data.filter(s => s.status === 'PENDING').length,
                sent: data.filter(s => s.status === 'SENT').length
            });
        });

        // 2. Fetch Settings from Backend
        const loadSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings`, {
                    headers: { 'x-admin-api-key': apiKey }
                });
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data);
                } else {
                    // Token invalid!
                    handleLogout();
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };

        loadSettings();

        return () => unsubscribe();
    }, [isAuthenticated, apiKey]);

    // --- Auth Handlers ---
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/request-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setAuthStep(2);
            } else {
                setAuthError(data.error || 'Failed to request OTP');
            }
        } catch (err) {
            setAuthError('Network error. Is backend running?');
        }
        setAuthLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (data.success && data.apiKey) {
                setApiKey(data.apiKey);
                localStorage.setItem('adminApiKey', data.apiKey);
                setIsAuthenticated(true);
            } else {
                setAuthError(data.error || 'Invalid OTP');
            }
        } catch (err) {
            setAuthError('Network error verifying OTP.');
        }
        setAuthLoading(false);
    };

    const handleLogout = () => {
        setApiKey('');
        localStorage.removeItem('adminApiKey');
        setIsAuthenticated(false);
        setAuthStep(1);
        setOtp('');
    };

    // --- Settings Handlers ---
    const handleSettingsChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const saveSettings = async () => {
        setSettingsSaving(true);
        setSettingsSuccess('');
        try {
            const res = await fetch(`${API_URL}/api/settings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-admin-api-key': apiKey 
                },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                setSettingsSuccess('Settings successfully deployed!');
                setTimeout(() => setSettingsSuccess(''), 3000);
            } else {
                alert("Failed to save. Unauthorized.");
                handleLogout();
            }
        } catch (error) {
            alert("Error saving settings.");
        }
        setSettingsSaving(false);
    };

    const filteredSubmissions = submissions.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Views ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b] font-sans selection:bg-emerald-500/30 text-zinc-100 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full relative z-10 glass-premium p-8 border border-white/5 shadow-2xl shadow-emerald-900/10"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <Shield className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Chonburi Command</h1>
                        <p className="text-sm text-zinc-400 mt-1">Authorized personnel only.</p>
                    </div>

                    {authError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle size={16} /> {authError}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {authStep === 1 ? (
                            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleRequestOtp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Admin Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600"
                                        placeholder="admin@company.com"
                                    />
                                </div>
                                <button disabled={authLoading} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                    {authLoading ? <Loader2 className="animate-spin" size={20} /> : 'Request Code'}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-zinc-400">Secure code dispatched to <br/><span className="text-zinc-200 font-medium">{email}</span></p>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2 text-center">Enter 6-Digit Code</label>
                                    <input 
                                        type="text" 
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-zinc-900/50 border border-emerald-500/30 rounded-lg px-4 py-4 text-white text-center text-3xl tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                                        placeholder="------"
                                        autoFocus
                                    />
                                </div>
                                <button disabled={authLoading || otp.length !== 6} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                                    {authLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify & Enter Terminal'}
                                </button>
                                <button type="button" onClick={() => setAuthStep(1)} className="w-full text-zinc-500 hover:text-zinc-300 text-sm py-2">Back</button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
            {/* Top Navigation */}
            <div className="border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded flex items-center justify-center border border-emerald-500/20">
                            <Shield className="w-4 h-4 text-emerald-500" />
                        </div>
                        <span className="font-bold tracking-tight text-white hidden sm:block">Chonburi Command</span>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/50">
                        <button onClick={() => setView('dashboard')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'dashboard' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
                            Monitoring
                        </button>
                        <button onClick={() => setView('settings')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'settings' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>
                            Mail Settings
                        </button>
                    </div>

                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors">
                        <LogOut size={16} /> <span className="hidden sm:inline">Terminate</span>
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {view === 'dashboard' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 flex items-center justify-between relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">Total Signals</p>
                                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                                </div>
                                <Activity className="text-zinc-700 w-8 h-8" />
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-500/70 text-xs uppercase tracking-wider font-semibold mb-1">Pending AI Review</p>
                                    <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
                                </div>
                                <Clock className="text-yellow-500/20 w-8 h-8" />
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-500/70 text-xs uppercase tracking-wider font-semibold mb-1">Dispatched</p>
                                    <p className="text-3xl font-bold text-emerald-500">{stats.sent}</p>
                                </div>
                                <CheckCircle className="text-emerald-500/20 w-8 h-8" />
                            </div>
                        </div>

                        {/* Logs Table */}
                        <div className="glass-premium rounded-xl border border-zinc-800/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h3 className="font-semibold text-white flex items-center gap-2"><Activity size={18} className="text-emerald-500" /> Incoming Traffic</h3>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Search logs..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800/50">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Identity</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Target Node (Vehicle)</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider">Timestamp</th>
                                            <th className="px-6 py-4 font-semibold tracking-wider text-right">Sys ID</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        <AnimatePresence>
                                            {filteredSubmissions.map((sub) => (
                                                <motion.tr 
                                                    key={sub.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-zinc-200">{sub.name}</div>
                                                        <div className="text-xs text-zinc-500 mt-0.5">{sub.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-300">
                                                        {sub.carMake} {sub.carModel} <span className="text-zinc-600">({sub.carYear})</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">
                                                        {sub.createdAt?.seconds ? new Date(sub.createdAt.seconds * 1000).toLocaleString() : 'Processing...'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">{sub.id.substring(0,8)}</span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                            {filteredSubmissions.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                                                        <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                                        No data streams found. 
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
                        
                        <div className="glass-premium border border-zinc-800/50 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Mail className="text-emerald-500" /> Postmaster Config</h2>
                                    <p className="text-sm text-zinc-400 mt-1">Manage global email routing rules and templates.</p>
                                </div>
                                
                                <button onClick={saveSettings} disabled={settingsSaving} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm">
                                    {settingsSaving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Deploy Config</>}
                                </button>
                            </div>

                            {settingsSuccess && (
                                <div className="bg-emerald-500/10 border-b border-emerald-500/20 p-3 px-6 text-emerald-400 text-sm flex items-center gap-2">
                                    <CheckCircle size={16} /> {settingsSuccess}
                                </div>
                            )}

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Sender Protocol (From)</label>
                                        <input name="sender_email" value={config.sender_email || ''} onChange={handleSettingsChange} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm" placeholder="noreply@domain.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Target Node (To)</label>
                                        <input name="receiver_email" value={config.receiver_email || ''} onChange={handleSettingsChange} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-sm" placeholder="admin@domain.com" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Transmission Subject</label>
                                    <input name="email_subject" value={config.email_subject || ''} onChange={handleSettingsChange} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" placeholder="New Alert" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex justify-between items-end">
                                        HTML Body Template
                                        <span className="text-[10px] text-emerald-500 lowercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">Variables: {'{name}, {email}, {carMake}, {data}'}</span>
                                    </label>
                                    <textarea name="email_body_template" value={config.email_body_template || ''} onChange={handleSettingsChange} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-4 text-zinc-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all h-48 font-mono text-xs leading-relaxed" spellCheck={false} />
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-zinc-600 font-mono">CONNECTION SECURED VIA V.2 ADMIN OTP HASH</p>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
