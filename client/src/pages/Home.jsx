import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, Shield, Zap, Star, Search, Calendar, Car, Tag } from 'lucide-react';
import { years, getBrands, getModels, getSubmodels } from '../data/carData';

const FadeIn = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

const StaggerContainer = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 }
                }
            }}
        >
            {children}
        </motion.div>
    );
};

const StaggerItem = ({ children }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
        >
            {children}
        </motion.div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const { lang } = useOutletContext();
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 150]);

    // Form State
    const [year, setYear] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [submodel, setSubmodel] = useState('');

    const handleSearch = () => {
        if (!year || !brand || !model || !submodel) return alert('Please complete all fields.');
        navigate('/quotes', { state: { year, brand, model, submodel } });
    };

    const texts = {
        EN: {
            tagline: "#1 IN CHONBURI",
            title: "PREMIUM PROTECTION",
            subtitle: "Thailand's most trusted insurance agency.",
            btn: "GET A QUOTE",
            stats: ["10k+ Customers", "24/7 Support", "Best Rates"],
            features: [
                { title: "Comprehensive", desc: "Full protection covering accidents, theft, and disasters.", icon: Shield, img: "/features/comprehensive.jpg" },
                { title: "Fast-Track Claims", desc: "Priority processing with our dedicated concierge.", icon: Zap, img: "/features/fasttrack.jpg" },
                { title: "Personalized", desc: "Tailored plans fitting your specific lifestyle.", icon: Star, img: "/features/personalized.jpg" }
            ]
        },
        TH: {
            tagline: "ที่สุดแห่งความไว้วางใจในชลบุรี",
            title: "ให้ Chonburi Insure ดูแลคุณ",
            subtitle: "ที่ปรึกษาด้านประกันภัยที่คุณไว้วางใจที่สุดในประเทศไทย",
            btn: "เช็คเบี้ยประกันภัย",
            stats: ["ลูกค้ากว่า 10,000 ราย", "ดูแลตลอด 24 ชั่วโมง", "ข้อเสนอที่ดีที่สุด"],
            features: [
                { title: "คุ้มครองครบวงจร", desc: "ครอบคลุมทุกความเสี่ยง ทั้งอุบัติเหตุ การโจรกรรม และภัยธรรมชาติ", icon: Shield, img: "/features/comprehensive.jpg" },
                { title: "บริการเคลมด่วนพิเศษ", desc: "จัดการเคลมรวดเร็วด้วยทีมงานดูแลส่วนบุคคล (Concierge)", icon: Zap, img: "/features/fasttrack.jpg" },
                { title: "แผนประกันเฉพาะคุณ", desc: "ออกแบบความคุ้มครองให้ตอบโจทย์ไลฟ์สไตล์ที่เป็นคุณ", icon: Star, img: "/features/personalized.jpg" }
            ]
        }
    };

    const t = texts[lang] || texts.EN;

    return (
        <div className="relative font-sans">
            {/* HERO SECTION */}
            <div className="min-h-[85vh] flex flex-col items-center justify-center relative p-6">
                <motion.div
                    style={{ y: yHero }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-2xl text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 mb-6 tracking-widest uppercase rounded-sm font-thai"
                    >
                        {t.tagline}
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 font-display tracking-tight leading-tight drop-shadow-lg font-thai">
                        {t.title}
                    </h1>

                    {/* Interactive Quote Form Box */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white/10 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-2xl text-left"
                    >
                        <h2 className="text-white font-bold text-xl mb-4 font-thai flex items-center gap-2">
                            <Search size={20} className="text-emerald-400" />
                            {lang === 'TH' ? 'เช็คราคาประกันรถยนต์' : 'Check Car Insurance Prices'}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* 1. Year */}
                            <div className="relative">
                                <label className="block text-zinc-300 text-xs font-bold mb-1 ml-1 font-thai">{lang === 'TH' ? '1. ปีจดทะเบียน' : '1. Year Registered'}</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-emerald-600" size={18} />
                                    <select 
                                        className="w-full bg-white text-zinc-900 font-bold pl-10 pr-4 py-3 rounded-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                                        value={year}
                                        onChange={(e) => { setYear(e.target.value); setBrand(''); setModel(''); setSubmodel(''); }}
                                    >
                                        <option value="" disabled>{lang === 'TH' ? 'เลือกปีรถยนต์' : 'Select Year'}</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* 2. Brand */}
                            <div className="relative">
                                <label className="block text-zinc-300 text-xs font-bold mb-1 ml-1 font-thai">{lang === 'TH' ? '2. ยี่ห้อรถ' : '2. Car Brand'}</label>
                                <div className="relative">
                                    <Car className={`absolute left-3 top-3.5 ${!year ? 'text-zinc-400' : 'text-emerald-600'}`} size={18} />
                                    <select 
                                        className="w-full bg-white text-zinc-900 font-bold pl-10 pr-4 py-3 rounded-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer disabled:bg-zinc-200 disabled:cursor-not-allowed"
                                        value={brand}
                                        onChange={(e) => { setBrand(e.target.value); setModel(''); setSubmodel(''); }}
                                        disabled={!year}
                                    >
                                        <option value="" disabled>{lang === 'TH' ? 'เลือกยี่ห้อรถ' : 'Select Brand'}</option>
                                        {getBrands().map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* 3. Model */}
                            <div className="relative">
                                <label className="block text-zinc-300 text-xs font-bold mb-1 ml-1 font-thai">{lang === 'TH' ? '3. รุ่นรถ' : '3. Car Model'}</label>
                                <select 
                                    className="w-full bg-white text-zinc-900 font-bold px-4 py-3 rounded-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer disabled:bg-zinc-200 disabled:cursor-not-allowed"
                                    value={model}
                                    onChange={(e) => { setModel(e.target.value); setSubmodel(''); }}
                                    disabled={!brand}
                                >
                                    <option value="" disabled>{lang === 'TH' ? 'เลือกรุ่นรถ' : 'Select Model'}</option>
                                    {getModels(brand).map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            {/* 4. Submodel */}
                            <div className="relative">
                                <label className="block text-zinc-300 text-xs font-bold mb-1 ml-1 font-thai">{lang === 'TH' ? '4. รุ่นย่อย' : '4. Sub-Model'}</label>
                                <select 
                                    className="w-full bg-white text-zinc-900 font-bold px-4 py-3 rounded-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer disabled:bg-zinc-200 disabled:cursor-not-allowed"
                                    value={submodel}
                                    onChange={(e) => setSubmodel(e.target.value)}
                                    disabled={!model}
                                >
                                    <option value="" disabled>{lang === 'TH' ? 'เลือกรุ่นย่อย' : 'Select Sub-model'}</option>
                                    {getSubmodels(brand, model).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={!year || !brand || !model || !submodel}
                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-500 disabled:text-zinc-300 disabled:cursor-not-allowed text-black font-bold py-4 px-6 text-lg transition-all rounded-sm font-thai shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                        >
                            {lang === 'TH' ? 'เปรียบเทียบราคาเลย!' : 'COMPARE PRICES NOW!'}
                        </button>
                    </motion.div>

                    <div className="mt-12 flex justify-center gap-8 border-t border-white/10 pt-8">
                        {t.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <span className="block text-white font-bold text-sm md:text-base font-thai">{stat}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Parallax Scroll Hint */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                >
                    <ChevronRight size={32} className="rotate-90" />
                </motion.div>
            </div>

            {/* FEATURE STRIP */}
            <div className="bg-white relative z-20 shadow-2xl border-y border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <StaggerContainer>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200 bg-white">
                            {t.features.map((f, i) => (
                                <StaggerItem key={i}>
                                    <div className="relative h-[400px] group overflow-hidden">
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${f.img}')` }}
                                        ></div>

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300"></div>

                                        {/* Content */}
                                        <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                                            <div className="mb-6 text-emerald-400 group-hover:text-amber-400 transition-colors duration-300">
                                                <f.icon size={48} strokeWidth={1.5} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3 font-thai shadow-sm">{f.title}</h3>
                                            <p className="text-zinc-200 leading-relaxed text-sm font-thai drop-shadow-md">
                                                {f.desc}
                                            </p>
                                        </div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerContainer>
                </div>
            </div>

            {/* PARTNERS STRIP */}
            <div className="bg-zinc-100 py-16 border-b border-zinc-200 relative z-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <FadeIn delay={0.2}>
                        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-10">Trusted Partners</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 transition duration-500">
                            {[
                                "/partners/deves.png",
                                "/partners/diamond.png",
                                "/partners/muangthai.png",
                                "/partners/navakij.jpg",
                                "/partners/indara.png",
                                "/partners/allianz.png"
                            ].map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt="Partner"
                                    className="h-16 w-auto object-contain hover:scale-110 transition-transform duration-300 drop-shadow-sm mix-blend-multiply"
                                />
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
};

export default Home;
