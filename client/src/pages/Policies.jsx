import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import {
    Car, Home, Heart, Briefcase, Plane, Shield,
    ChevronRight, Zap, Check, X, AlertCircle,
    Flame, Target, Users, HelpCircle,
    UserMinus, CarFront, Construction, Info
} from 'lucide-react';

const ScenarioSimulator = ({ lang }) => {
    const [activeScenario, setActiveScenario] = useState(null);

    const scenarios = {
        EN: [
            {
                id: 'collision',
                icon: CarFront,
                title: "Car vs Car",
                desc: "You hit a land vehicle on the road (another car, taxi, bike).",
                covered: ["Type 1", "Type 2+", "Type 3+"]
            },
            {
                id: 'hit-object',
                icon: Construction,
                title: "Hit a Pole",
                desc: "Self-accident (Hitting a wall, pole, or fence). No partner involved.",
                covered: ["Type 1"]
            },
            {
                id: 'stolen',
                icon: UserMinus,
                title: "Stolen / Fire",
                desc: "Your car is stolen, robbed, or catches fire.",
                covered: ["Type 1", "Type 2+", "Type 2"]
            },
            {
                id: 'third-party',
                icon: Users,
                title: "Third Party",
                desc: "Damage to someone else's car, property, or bodily injury.",
                covered: ["Type 1", "Type 2+", "Type 3+", "Type 2", "Type 3"]
            }
        ],
        TH: [
            {
                id: 'collision',
                icon: CarFront,
                title: "รถชนรถ",
                desc: "อุบัติเหตุที่มีคู่กรณีเป็นยานพาหนะทางบก (รถยนต์, มอเตอร์ไซค์, อื่นๆ)",
                covered: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+"]
            },
            {
                id: 'hit-object',
                icon: Construction,
                title: "ชนเสา/กำแพง",
                desc: "อุบัติเหตุแบบไม่มีคู่กรณี (ถอยชนเสา, ครูดฟุตบาท, ตกหลุม)",
                covered: ["ชั้น 1"]
            },
            {
                id: 'stolen',
                icon: UserMinus,
                title: "รถหาย/ไฟไหม้",
                desc: "รถถูกโจรกรรม ปล้นจี้สูญหาย หรือเกิดเหตุเพลิงไหม้",
                covered: ["ชั้น 1", "ชั้น 2+", "ชั้น 2"]
            },
            {
                id: 'third-party',
                icon: Users,
                title: "คู่กรณี",
                desc: "ความเสียหายต่อทรัพย์สินหรือร่างกายของบุคคลภายนอก",
                covered: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+", "ชั้น 2", "ชั้น 3"]
            }
        ]
    };

    const plans = {
        EN: ["Type 1", "Type 2+", "Type 3+", "Type 2", "Type 3"],
        TH: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+", "ชั้น 2", "ชั้น 3"]
    };

    const currentScenarios = scenarios[lang] || scenarios.EN;
    const currentPlans = plans[lang] || plans.EN;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 bg-zinc-900/80 rounded-2xl p-6 border border-white/10 overflow-hidden relative shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12">
                <Target size={160} />
            </div>

            <h3 className="text-xl font-bold text-white mb-6 font-thai flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <HelpCircle className="text-emerald-500" size={20} />
                </div>
                {lang === 'TH' ? 'จำลองสถานการณ์ความคุ้มครอง' : 'Coverage Scenario Simulator'}
            </h3>

            <p className="text-zinc-400 text-sm mb-8 font-thai leading-relaxed max-w-lg">
                {lang === 'TH'
                    ? 'หากคุณไม่แน่ใจว่าเหตุการณ์ใดครอบคลุมบ้าง ให้ลองเลือกเหตุการณ์จำลองด้านล่างเพื่อเช็คความคุ้มครอง'
                    : 'Not sure what is covered? Select a scenario below to instantly see which plans have your back.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {currentScenarios.map((s) => (
                    <motion.button
                        key={s.id}
                        whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveScenario(s)}
                        className={`p-5 rounded-xl flex flex-col items-center gap-4 transition-all duration-300 border backdrop-blur-sm ${activeScenario?.id === s.id
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20'
                            }`}
                    >
                        <s.icon size={32} strokeWidth={activeScenario?.id === s.id ? 2.5 : 1.5} />
                        <span className="text-sm font-bold font-thai tracking-tight">{s.title}</span>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeScenario && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="p-5 bg-black/40 rounded-xl border border-emerald-500/20 shadow-inner"
                    >
                        <div className="flex items-start gap-3 mb-6">
                            <div className="mt-1"><Info size={16} className="text-emerald-500" /></div>
                            <p className="text-emerald-300 text-sm font-thai leading-relaxed">
                                {activeScenario.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {currentPlans.map((plan) => {
                                const isCovered = activeScenario.covered.includes(plan);
                                return (
                                    <motion.div
                                        key={plan}
                                        className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${isCovered
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                            : 'bg-zinc-800/40 text-zinc-600 border-transparent opacity-40 grayscale blur-[0.5px]'
                                            }`}
                                    >
                                        {isCovered ? <Check size={14} strokeWidth={3} /> : <X size={14} />}
                                        {plan}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ComparisonTable = ({ lang }) => {
    const data = {
        EN: {
            headers: ["Type 1", "Type 2+", "Type 3+", "Type 2", "Type 3"],
            sections: [
                {
                    title: "Third Party Liability",
                    rows: [
                        { name: "Others' Property", values: [true, true, true, true, true] },
                        { name: "Others' Life / Bodily Injury", values: [true, true, true, true, true] }
                    ]
                },
                {
                    title: "Your Vehicle Coverage",
                    rows: [
                        { name: "Collision with Land Vehicle", values: [true, true, true, false, false] },
                        { name: "No Third Party (Hit Wall/Fence)", values: [true, false, false, false, false] }
                    ]
                },
                {
                    title: "Special Protection",
                    rows: [
                        { name: "Car Stolen / Robbery", values: [true, true, false, true, false] },
                        { name: "Fire Damage", values: [true, true, false, true, false] }
                    ]
                }
            ],
            note: "* Type 2+ and 3+ cover car body only when partners are present (On-road collisions)."
        },
        TH: {
            headers: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+", "ชั้น 2", "ชั้น 3"],
            sections: [
                {
                    title: "ความคุ้มครองต่อบุคคลภายนอก",
                    rows: [
                        { name: "ทรัพย์สินบุคคลภายนอก", values: [true, true, true, true, true] },
                        { name: "ชีวิต / ร่างกายบุคคลภายนอก", values: [true, true, true, true, true] }
                    ]
                },
                {
                    title: "ความคุ้มครองต่อตัวรถเรา",
                    rows: [
                        { name: "รถชนรถ (มีคู่กรณีบนถนน)", values: [true, true, true, false, false] },
                        { name: "ชนไม่มีคู่กรณี (ชนเสา/กำแพง)", values: [true, false, false, false, false] }
                    ]
                },
                {
                    title: "ความคุ้มครองพิเศษ",
                    rows: [
                        { name: "รถยนต์สูญหาย / โจรกรรม", values: [true, true, false, true, false] },
                        { name: "รถเกิดไฟไหม้", values: [true, true, false, true, false] }
                    ]
                }
            ],
            note: "* ชั้น 2+ และ 3+ คุ้มครองตัวรถเฉพาะอุบัติเหตุที่มีคู่กรณีเป็นยานพาหนะทางบกเท่านั้น"
        }
    };

    const content = data[lang] || data.EN;

    return (
        <div className="mt-10 overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-[700px] text-sm md:text-base">
                {/* Header */}
                <div className="grid grid-cols-6 gap-3 mb-6 text-center font-thai font-bold text-white/90">
                    <div className="text-left flex items-center text-zinc-500 uppercase text-[10px] tracking-[0.2em] font-sans pb-2">Coverage Grid</div>
                    {content.headers.map((h, i) => (
                        <div key={i} className={`py-4 rounded-xl border border-white/5 backdrop-blur-md transition-all ${i === 0 ? 'bg-emerald-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] border-emerald-400/30' : 'bg-white/5 hover:bg-white/10'}`}>
                            {h}
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="space-y-8">
                    {content.sections.map((section, sIdx) => (
                        <motion.div
                            key={sIdx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sIdx * 0.1 }}
                        >
                            <h4 className="text-emerald-400 font-bold font-thai text-[11px] mb-3 flex items-center gap-2 uppercase tracking-widest pl-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                                {section.title}
                            </h4>
                            <div className="bg-zinc-800/30 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                {section.rows.map((row, rIdx) => (
                                    <div key={rIdx} className="grid grid-cols-6 gap-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                        <div className="p-4 text-zinc-400 font-thai text-sm flex items-center pl-6 group-hover:text-zinc-100 transition-colors">
                                            {row.name}
                                        </div>
                                        {row.values.map((val, vIdx) => (
                                            <div key={vIdx} className={`p-4 flex items-center justify-center border-l border-white/5 ${vIdx === 0 ? 'bg-emerald-500/5' : ''}`}>
                                                {val === true ? (
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        className="bg-emerald-500/20 p-1.5 rounded-full"
                                                    >
                                                        <Check size={18} className="text-emerald-500 shadow-emerald-500/50" strokeWidth={3} />
                                                    </motion.div>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-zinc-700/50"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-end gap-1">
                    <p className="text-amber-500/90 font-thai text-[11px] flex items-center gap-1.5 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">
                        <AlertCircle size={12} /> {content.note}
                    </p>
                    <span className="text-zinc-600 font-thai text-[10px] mr-3">Last updated: 2024 Insurance Standard Guidelines</span>
                </div>
            </div>
        </div>
    );
};

const Policies = () => {
    const { lang } = useOutletContext();
    const [selectedId, setSelectedId] = useState(null);

    const content = {
        EN: {
            title: "Insurance Plans",
            subtitle: "Luxury protection meets professional risk management.",
            policies: [
                { id: 1, title: "Motor Insurance", desc: "Choose between 5 meticulous levels of protection.", icon: Car, details: "We provide Type 1, 2+, 3+, 2, and 3 plans. Whether you want comprehensive 'All-Risk' or essential Third-Party protection." },
                { id: 2, title: "Home & Property", desc: "Protect your residence from fire, burglary, and natural disasters.", icon: Home, details: "Covers structure and content. Includes 24/7 home emergency assistance services." },
                { id: 3, title: "Health & Life", desc: "Secure the well-being of your loved ones.", icon: Heart, details: "IPD/OPD options at top private hospitals. No advance payment required for network hospitals." },
                { id: 4, title: "Business Protection", desc: "Mitigate risks for your SME or corporate assets.", icon: Briefcase, details: "Property damage, liability, and business interruption coverage tailored to your industry." },
                { id: 5, title: "Travel Assure", desc: "World-class coverage for your international journeys.", icon: Plane, details: "Medical emergencies abroad, flight delays, and lost luggage. Global assistance coverage." },
                { id: 6, title: "Cyber Shield", desc: "Defend your digital assets from modern threats.", icon: Shield, details: "Data breach response, ransomware protection, and digital liability insurance." },
            ],
            cta: "Get Instant Quote"
        },
        TH: {
            title: "แผนประกันภัยของเรา",
            subtitle: "การดูแลอย่างมืออาชีพ เพื่อความอุ่นใจที่เหนือกว่า",
            policies: [
                { id: 1, title: "ประกันภัยรถยนต์", desc: "เลือกความคุ้มครองที่สมบูรณ์แบบได้ 5 ระดับ", icon: Car, details: "บริการทั้ง ชั้น 1, 2+, 3+, 2 และ 3 ครอบคลุมตั้งแต่ 'คุ้มครองทุกกรณี' ไปจนถึง 'คุ้มครองคู่กรณีพื้นฐาน'" },
                { id: 2, title: "ประกันบ้านและทรัพย์สิน", desc: "ปกป้องบ้านและอาคารจากภัยพิบัติและโจรกรรม", icon: Home, details: "คุ้มครองตัวอาคารและเฟอร์นิเจอร์ พร้อมบริการช่วยเหลือฉุกเฉินในบ้าน 24 ชม." },
                { id: 3, title: "ประกันสุขภาพและชีวิต", desc: "ดูแลสวัสดิการเพื่อตัวคุณและคนในครอบครัว", icon: Heart, details: "รองรับ OPD/IPD ใน รพ. เอกชนชั้นนำ ไม่ต้องสำรองจ่ายในโรงพยาบาลคู่สัญญา" },
                { id: 4, title: "ประกันธุรกิจ", desc: "บริหารความเสี่ยงสำหรับธุรกิจและ SME", icon: Briefcase, details: "คุ้มครองทรัพย์สิน ความรับผิดต่อบุคคลภายนอก และความเสียหายจากการหยุดชะงักทางธุรกิจ" },
                { id: 5, title: "ประกันเดินทาง", desc: "ท่องเที่ยวรอบโลกอย่างไร้กังวล", icon: Plane, details: "ค่ารักษาอาการเจ็บป่วยต่างประเทศ เที่ยวบินล่าช้า กระเป๋าหาย พร้อมดูแลตลอดเส้นทาง" },
                { id: 6, title: "ประกันภัยไซเบอร์", desc: "ปกป้องข้อมูลสำคัญจากภัยคุกคามดิจิทัล", icon: Shield, details: "เยียวยาเหตุการณ์ข้อมูลรั่วไหล มัลแวร์เรียกค่าไถ่ และความรับผิดทางโลกออนไลน์" },
            ],
            cta: "เช็คราคาประกันรถยนต์"
        }
    };

    const t = content[lang] || content.EN;

    return (
        <div className="min-h-screen pt-24 pb-12 relative bg-zinc-900 overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[200px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 font-thai tracking-tight"
                    >
                        {t.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-xl font-light font-thai max-w-3xl mx-auto leading-relaxed"
                    >
                        {t.subtitle}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {t.policies.map((policy) => (
                        <motion.div
                            layoutId={`card-${policy.id}`}
                            key={policy.id}
                            onClick={() => setSelectedId(selectedId === policy.id ? null : policy.id)}
                            whileHover={{ y: -10 }}
                            className={`glass-premium p-8 cursor-pointer group transition-all duration-500 ${selectedId === policy.id ? 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2 bg-zinc-800/95 border-emerald-500/40 shadow-emerald-500/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20' : 'relative z-10 hover:border-white/10'}`}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-2xl transition-all duration-500 ${selectedId === policy.id ? 'bg-emerald-500 text-white rotate-[10deg] scale-110' : 'bg-white/5 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-[5deg]'}`}>
                                    <policy.icon size={32} strokeWidth={1.5} />
                                </div>
                                <div className={`text-white/10 transition-colors duration-500 ${selectedId === policy.id ? 'text-amber-400' : 'group-hover:text-white/30'}`}>
                                    <Zap size={24} fill="currentColor" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 font-thai tracking-tight">{policy.title}</h3>
                            <p className={`text-zinc-400 text-base font-thai leading-relaxed mb-6 transition-colors ${selectedId === policy.id ? 'text-zinc-200' : ''}`}>
                                {policy.desc}
                            </p>

                            <AnimatePresence>
                                {selectedId === policy.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-white/10 pt-8 mt-6 overflow-hidden"
                                    >
                                        <p className="text-emerald-400 font-thai text-sm mb-10 leading-relaxed font-medium bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                                            {policy.details}
                                        </p>

                                        {policy.id === 1 && (
                                            <div className="space-y-12">
                                                <ComparisonTable lang={lang} />
                                                <ScenarioSimulator lang={lang} />
                                            </div>
                                        )}

                                        <div className="mt-12 flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-12 rounded-lg font-bold transition-all flex items-center justify-center gap-3 font-thai shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] group/btn"
                                            >
                                                {t.cta}
                                                <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {selectedId !== policy.id && (
                                <div className="text-emerald-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                                    Explore Plan <div className="w-8 h-[1px] bg-emerald-500"></div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-zinc-500 text-sm font-thai">
                        Certified Broker | License No. 000XXX-XXXX-00
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Policies;
