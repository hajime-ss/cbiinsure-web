import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, Car, Save, Mail } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

// Simplified Country List (Can be expanded)
const countries = [
    { code: "+66", name: "Thailand (ไทย)", flag: "🇹🇭" },
    { code: "+1", name: "USA", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    // Add more as needed
];

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        nickname: '',
        dob: '',
        email: '',
        phoneCode: '+66', // Default
        phone: '',
        carsOwned: 0
    });

    const [age, setAge] = useState(null);

    // Auth Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Try to fetch existing data
                const docRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData({ ...formData, ...docSnap.data() });
                } else {
                    // Pre-fill name from Google if available
                    const names = currentUser.displayName?.split(' ') || [];
                    setFormData(prev => ({
                        ...prev,
                        name: names[0] || '',
                        surname: names.slice(1).join(' ') || '',
                        email: currentUser.email || '',
                        phone: currentUser.phoneNumber ? currentUser.phoneNumber.replace('+66', '0').replace('+1', '') : ''
                    }));

                    // Attempt Auto-Detect Country (Simple Timezone heuristic for now)
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    if (!tz.includes('Bangkok') && !tz.includes('Asia')) {
                        // Very rough fallback, ideally use IP API
                        // setFormData(prev => ({ ...prev, phoneCode: '+1' })); 
                    }
                }
                setLoading(false);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Auto Calculate Age
    useEffect(() => {
        if (formData.dob) {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
        }
    }, [formData.dob]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                email: formData.email || user.email || null,
                updatedAt: new Date()
            }, { merge: true });
            alert("Profile Saved!");


            // Check returnUrl
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');

            navigate(returnUrl || '/');
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Error saving profile");
        }
    };

    if (loading) return <div className="text-white text-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-zinc-900 relative">
            <div className="absolute inset-0 bg-[url('/bg2.jpg')] bg-cover bg-center opacity-10 fixed"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-premium p-8 max-w-2xl mx-auto relative z-10"
            >
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    {user?.photoURL && (
                        <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-emerald-500" />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-white font-thai">ตั้งค่าข้อมูลส่วนตัว / Profile Setup</h1>
                        <p className="text-zinc-400 text-sm">Please complete your information to continue.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2 font-thai">ชื่อ (Name)</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-emerald-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="input-sharp pl-10 pr-4 font-thai"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2 font-thai">นามสกุล (Surname)</label>
                            <input
                                type="text"
                                value={formData.surname}
                                onChange={e => setFormData({ ...formData, surname: e.target.value })}
                                className="input-sharp px-4 font-thai"
                                required
                            />
                        </div>
                    </div>

                    {/* Nickname & DOB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2 font-thai">ชื่อเล่น (Nickname)</label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                className="input-sharp px-4 font-thai"
                            />
                        </div>
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2 font-thai">
                                วันเกิด (Date of Birth)
                                {age !== null && <span className="text-emerald-400 ml-2 text-xs">(Age: {age})</span>}
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-emerald-500" size={18} />
                                <input
                                    type="date"
                                    value={formData.dob}
                                    onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                    className="input-sharp pl-10 pr-4 font-sans"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 font-thai">อีเมล (Email Address)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-emerald-500" size={18} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="input-sharp pl-10 pr-4 font-sans"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 font-thai">เบอร์โทรศัพท์ (Telephone)</label>
                        <div className="flex gap-2">
                            <div className="w-1/3 md:w-1/4">
                                <select
                                    value={formData.phoneCode}
                                    onChange={e => setFormData({ ...formData, phoneCode: e.target.value })}
                                    className="w-full h-full input-sharp px-2 font-thai text-sm"
                                >
                                    {countries.map(c => (
                                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 relative">
                                <Phone className="absolute left-3 top-3 text-emerald-500" size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    placeholder="08X-XXX-XXXX"
                                    className="input-sharp pl-10 pr-4 font-thai"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cars Owned */}
                    <div>
                        <label className="block text-zinc-400 text-sm mb-2 font-thai">จำนวนรถที่มี (Number of Cars Owned)</label>
                        <div className="relative">
                            <Car className="absolute left-3 top-3 text-emerald-500" size={18} />
                            <input
                                type="number"
                                min="0"
                                value={formData.carsOwned}
                                onChange={e => setFormData({ ...formData, carsOwned: parseInt(e.target.value) })}
                                className="input-sharp pl-10 pr-4 font-thai"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-sm mt-8 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Save size={20} />
                        Save Profile / บันทึกข้อมูล
                    </button>

                </form>
            </motion.div>
        </div>
    );
};

export default UserProfile;
