import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Clock, CheckCircle, XCircle, Search, Mail, Settings as SettingsIcon, Save } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/50",
        SENT: "bg-emerald-500/10 text-emerald-500 border-emerald-500/50",
        FAILED: "bg-red-500/10 text-red-500 border-red-500/50",
        PROCESSING: "bg-blue-500/10 text-blue-500 border-blue-500/50"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, sent: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('dashboard');
    const [config, setConfig] = useState({
        sender_email: '',
        receiver_email: '',
        email_subject: 'New Insurance Application',
        email_body_template: 'New application from {name}.'
    });

    useEffect(() => {
        const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(data);

            // Calculate stats
            const total = data.length;
            const pending = data.filter(s => s.status === 'PENDING').length;
            const sent = data.filter(s => s.status === 'SENT').length;
            setStats({ total, pending, sent });
        });
        return () => unsubscribe();
    }, []);

    // Fetch Config on mount
    useEffect(() => {
        getDoc(doc(db, "config", "email")).then(docSnap => {
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            }
        });
    }, []);

    const handleConfigChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const saveConfig = async () => {
        try {
            await setDoc(doc(db, "config", "email"), config);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Error saving settings.");
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black p-6 font-sans">
            {/* Header / Stats */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-emerald-500" /> Chonburi Command
                    </h1>
                    <p className="text-zinc-500 text-sm">Chonburi Insurance - Real-time monitoring</p>
                </div>

                <div className="flex gap-4">
                    <div className="glass px-6 py-3 rounded-lg text-center">
                        <p className="text-zinc-400 text-xs uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="glass px-6 py-3 rounded-lg text-center border-yellow-500/20">
                        <p className="text-yellow-500/80 text-xs uppercase tracking-wider">Pending</p>
                        <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                    </div>
                    <div className="glass px-6 py-3 rounded-lg text-center border-emerald-500/20">
                        <p className="text-emerald-500/80 text-xs uppercase tracking-wider">Sent</p>
                        <p className="text-2xl font-bold text-emerald-500">{stats.sent}</p>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setView('dashboard')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${view === 'dashboard' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white glass'}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setView('settings')}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${view === 'settings' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white glass'}`}
                >
                    <SettingsIcon size={18} /> Settings
                </button>
            </div>

            {view === 'dashboard' ? (
                /* Main Content */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* Live Feed Column */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 text-zinc-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                className="input-luxury pl-12 bg-zinc-900/40"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="glass rounded-xl overflow-hidden min-h-[500px]">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="bg-zinc-900/50 text-zinc-300 uppercase text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Applicant</th>
                                        <th className="p-4">Vehicle</th>
                                        <th className="p-4">Applied</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredSubmissions.map((sub) => (
                                            <motion.tr
                                                key={sub.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <StatusBadge status={sub.status} />
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-white font-medium">{sub.name}</p>
                                                    <p className="text-xs text-zinc-500">{sub.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p>{sub.carYear} {sub.carMake}</p>
                                                    <p className="text-xs text-zinc-500">{sub.carModel}</p>
                                                </td>
                                                <td className="p-4 font-mono text-xs">
                                                    {sub.createdAt?.seconds ? new Date(sub.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-zinc-500 hover:text-white transition p-2 bg-zinc-800/50 rounded-lg">
                                                        View
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        {filteredSubmissions.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-zinc-500">
                                                    No submissions found
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* System Stream / Logs */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-xl p-4 h-full">
                            <h3 className="text-zinc-400 font-semibold mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-emerald-500" /> System Stream
                            </h3>
                            <div className="space-y-4 font-mono text-xs max-h-[600px] overflow-y-auto">
                                {submissions.slice(0, 10).map((sub, i) => (
                                    <div key={sub.id} className="flex gap-3 relative pb-4 border-l border-zinc-800 pl-4 last:border-0">
                                        <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${sub.status === 'PENDING' ? 'bg-yellow-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                                        <div>
                                            <p className="text-zinc-300">New submission: {sub.name}</p>
                                            <span className="text-zinc-600">ID: {sub.id.slice(0, 8)}...</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Settings View */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto glass rounded-xl p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Mail className="text-emerald-500" /> Email Configuration
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Sender Email (From)</label>
                            <input name="sender_email" value={config.sender_email || ''} onChange={handleConfigChange} className="input-luxury" placeholder="noreply@company.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Receiver Email (To)</label>
                            <input name="receiver_email" value={config.receiver_email || ''} onChange={handleConfigChange} className="input-luxury" placeholder="admin@company.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Email Subject</label>
                            <input name="email_subject" value={config.email_subject || ''} onChange={handleConfigChange} className="input-luxury" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Email Body Template</label>
                            <textarea name="email_body_template" value={config.email_body_template || ''} onChange={handleConfigChange} className="input-luxury h-32 font-mono" />
                            <p className="text-xs text-zinc-500 mt-2">Use {'{name}'}, {'{carMake}'}, {'{email}'} as placeholders.</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button onClick={saveConfig} className="btn-primary flex items-center gap-2">
                                <Save size={18} /> Save Settings
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
