import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Phone, FileText, Camera, Send, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const Claims = () => {
    const { lang } = useOutletContext();
    const [activeStep, setActiveStep] = useState(0);

    const content = {
        EN: {
            title: "Claims Center",
            subtitle: "We're here to help when things go wrong.",
            emergency: "Emergency Assistance 24/7",
            call_btn: "Call Hotine 1234",
            steps_title: "How to Claim",
            steps: [
                { title: "Report Incident", desc: "Call us immediately or use the LINE app to report the accident.", icon: Phone },
                { title: "Document", desc: "Take clear photos of damage and collect details of other parties.", icon: Camera },
                { title: "Submit", desc: "Send documents via our portal or email within 24 hours.", icon: Send },
                { title: "Track", desc: "Receive real-time updates on your repair status.", icon: CheckCircle },
            ],
            forms_title: "Downloadable Forms"
        },
        TH: {
            title: "ศูนย์รับแจ้งอุบัติเหตุ",
            subtitle: "เราพร้อมดูแลเคียงข้างคุณในทุกเหตุการณ์",
            emergency: "แจ้งเหตุฉุกเฉิน 24 ชม.",
            call_btn: "โทรสายด่วน 1234",
            steps_title: "ขั้นตอนการเคลม",
            steps: [
                { title: "แจ้งเหตุ", desc: "โทรหาเราทันทีหรือแจ้งผ่าน LINE เมื่อเกิดอุบัติเหตุ", icon: Phone },
                { title: "เก็บหลักฐาน", desc: "ถ่ายรูปความเสียหายและเก็บข้อมูลคู่กรณีให้ครบถ้วน", icon: Camera },
                { title: "ยื่นเอกสาร", desc: "ส่งเอกสารผ่านระบบออนไลน์หรืออีเมลภายใน 24 ชม.", icon: Send },
                { title: "ติดตามผล", desc: "รับการแจ้งเตือนสถานะการซ่อมแบบเรียลไทม์", icon: CheckCircle },
            ],
            forms_title: "ดาวน์โหลดแบบฟอร์ม"
        }
    };

    const t = content[lang] || content.EN;

    return (
        <div className="min-h-screen pt-24 pb-12 relative bg-zinc-900 text-white">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 font-thai">{t.title}</h1>
                    <p className="text-zinc-400 font-thai">{t.subtitle}</p>
                </div>

                {/* Emergency Section */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-red-600 to-red-800 rounded-sm p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-red-900/30 mb-20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                    <div className="flex items-center gap-6 relative z-10 mb-6 md:mb-0">
                        <div className="bg-white/20 p-4 rounded-full animate-pulse">
                            <AlertTriangle size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-thai">{t.emergency}</h2>
                            <p className="text-red-200 text-sm">Fast-track team ready to dispatch.</p>
                        </div>
                    </div>
                    <button className="bg-white text-red-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-zinc-100 transition-colors flex items-center gap-2 font-thai relative z-10">
                        <Phone size={20} />
                        {t.call_btn}
                    </button>
                </motion.div>

                {/* Wizard Steps */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold mb-10 text-center font-thai">{t.steps_title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {t.steps.map((step, i) => (
                            <div key={i} className="relative group">
                                <motion.div
                                    className="glass-premium p-6 h-full flex flex-col items-center text-center relative z-10 group-hover:border-emerald-500/50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-emerald-500 mb-4 border border-zinc-700 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <step.icon size={24} />
                                    </div>
                                    <h3 className="font-bold mb-2 font-thai">{step.title}</h3>
                                    <p className="text-xs text-zinc-400 font-thai">{step.desc}</p>
                                </motion.div>
                                {/* Connector Line (Desktop) */}
                                {i < t.steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[2.5rem] right-[-50%] w-full h-[2px] bg-zinc-800 z-0"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download Resources */}
                <div className="glass-premium p-8 rounded-sm">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-thai">
                        <FileText className="text-emerald-500" />
                        {t.forms_title}
                    </h3>
                    <div className="space-y-4">
                        {[1, 2].map((form) => (
                            <div key={form} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-sm border border-zinc-700/50 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <FileText size={20} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                    <span className="text-zinc-300 font-thai">Claim Request Form Type {form} (PDF)</span>
                                </div>
                                <Download size={20} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Claims;
