import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, AlertTriangle, Zap } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const InsuranceInfo = () => {
    const navigate = useNavigate();
    const { lang } = useOutletContext();

    const text = {
        EN: {
            title: "Insurance in Thailand",
            subtitle: "Simplified.",
            desc: "Understanding the difference between Mandatory (Por Ror Bor) and Voluntary classes to help you drive with confidence.",
            mand: { title: "Mandatory (CTPL)", sub: "Por Ror Bor", desc: "Required by law. Covers medical bills & death only. NO vehicle coverage.", warning: "Cannot renew tax without this." },
            vol: { title: "Voluntary Insurance", sub: "Classes 1-3", desc: "Extra protection. Covers your car, theft, fire, flood, and high liability.", badge: "Recommended" },
            compare: "Compare Classes",
            table: {
                headers: ["Class 1", "Class 2+", "Class 3+", "Class 3"],
                rows: ["Car Collision (With Party)", "Car Collision (No Party/Self)", "Theft & Fire", "Flood Damage", "Third Party Liability"]
            },
            cards: [
                { title: "I hit another car", desc: "Standard accident.", badges: ["Class 1", "Class 2+", "Class 3+"] },
                { title: "I hit a pole", desc: "Self-accident.", badges: ["Class 1 Only"] },
                { title: "My car flooded", desc: "Natural disaster.", badges: ["Class 1"] }
            ],
            btn: "Get Your Quote Now"
        },
        TH: {
            title: "ประกันภัยรถยนต์ในประเทศไทย",
            subtitle: "เข้าใจง่าย ไม่ซับซ้อน",
            desc: "ทำความเข้าใจความแตกต่างระหว่าง พ.ร.บ. และประกันภัยสมัครใจ",
            mand: { title: "ประกันภัยภาคบังคับ (พ.ร.บ.)", sub: "", desc: "กฎหมายบังคับ เพื่อคุ้มครองค่ารักษาพยาบาลและกรณีเสียชีวิตของบุคคล", warning: "ต้องใช้ประกอบการต่อภาษีรถยนต์ประจำปี" },
            vol: { title: "ประกันภัยภาคสมัครใจ", sub: "", desc: "ความคุ้มครองเพิ่มเติมสำหรับตัวรถ การโจรกรรม และทรัพย์สิน", badge: "แนะนำ" },
            compare: "เปรียบเทียบประเภทความคุ้มครอง",
            table: {
                headers: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+", "ชั้น 3"],
                rows: ["อุบัติเหตุรถชนรถ (มีคู่กรณี)", "อุบัติเหตุแบบไม่มีคู่กรณี (ชนเสา/ขูดขีด)", "รถหาย / ไฟไหม้", "ความเสียหายจากน้ำท่วม", "ความรับผิดต่อทรัพย์สินบุคคลภายนอก"]
            },
            cards: [
                { title: "กรณีรถชนกับรถคันอื่น", desc: "อุบัติเหตุทั่วไป", badges: ["ชั้น 1", "ชั้น 2+", "ชั้น 3+"] },
                { title: "กรณีชนสิ่งของ / ไม่มีคู่กรณี", desc: "อุบัติเหตุที่ไม่ได้เกิดจากการชนกับรถคันอื่น", badges: ["ชั้น 1 เท่านั้น"] },
                { title: "กรณีเกิดความเสียหายจากน้ำท่วม", desc: "ภัยพิบัติทางธรรมชาติ", badges: ["ชั้น 1"] }
            ],
            btn: "เช็คเบี้ยประกันภัย"
        },
        ZH: {
            title: "泰国保险",
            subtitle: "化繁为简。",
            desc: "了解强制险（Por Ror Bor）和商业险之间的区别，助您安心驾驶。",
            mand: { title: "强制险（CTPL）", sub: "Por Ror Bor", desc: "法律规定。仅涵盖医疗费用和死亡。不涵盖车辆损坏。", warning: "没有它无法续订路税。" },
            vol: { title: "商业保险", sub: "一至三等", desc: "额外保障。涵盖您的车辆、盗窃、火灾、洪水和高额责任。", badge: "推荐" },
            compare: "比较等级",
            table: {
                headers: ["一等", "二等+", "三等+", "三等"],
                rows: ["车辆碰撞（有第三方）", "车辆碰撞（无第三方/单方）", "盗窃与火灾", "洪水损坏", "第三方责任"]
            },
            cards: [
                { title: "我撞到了另一辆车", desc: "标准事故。", badges: ["一等", "二等+", "三等+"] },
                { title: "我撞到了柱子", desc: "单方事故。", badges: ["仅限一等"] },
                { title: "我的车被水淹了", desc: "自然灾害。", badges: ["一等"] }
            ],
            btn: "立即获取报价"
        }
    };

    const t = text[lang] || text.EN;

    return (
        <div className="min-h-screen bg-zinc-50 text-slate-800 pb-32">

            {/* Header Section */}
            <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-6 font-display font-thai"
                    >
                        {t.title} <span className="text-emerald-400">{t.subtitle}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-thai"
                    >
                        {t.desc}
                    </motion.p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
                {/* 1. Mandatory vs Voluntary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 shadow-xl border border-slate-100 rounded-sm"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-red-100 p-3 rounded-sm text-red-600">
                                <AlertTriangle size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 font-thai">{t.mand.title}</h2>
                            </div>
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed font-thai">
                            {t.mand.desc}
                        </p>
                        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm inline-block font-semibold rounded-sm font-thai">
                            {t.mand.warning}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-8 shadow-xl border border-slate-100 relative overflow-hidden rounded-sm"
                    >
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 font-thai">{t.vol.badge}</div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-emerald-100 p-3 rounded-sm text-emerald-600">
                                <Shield size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 font-thai">{t.vol.title}</h2>
                            </div>
                        </div>
                        <p className="text-slate-600 mb-6 leading-relaxed font-thai">
                            {t.vol.desc}
                        </p>
                    </motion.div>
                </div>

                {/* 2. Comparison Matrix */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white shadow-2xl overflow-hidden border border-slate-200 mb-20 hidden md:block rounded-sm"
                >
                    <div className="bg-slate-900 text-white p-8 text-center">
                        <h2 className="text-3xl font-bold font-thai">{t.compare}</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-6 text-slate-500 font-medium w-1/4"></th>
                                    {t.table.headers.map((h, i) => (
                                        <th key={i} className="p-6 text-center w-1/6 font-bold text-xl font-thai">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { c1: true, c2p: true, c3p: true, c3: false },
                                    { c1: true, c2p: false, c3p: false, c3: false },
                                    { c1: true, c2p: true, c3p: false, c3: false },
                                    { c1: true, c2p: false, c3p: false, c3: false },
                                    { c1: true, c2p: true, c3p: true, c3: true },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition">
                                        <td className="p-6 font-bold text-slate-700 font-thai">{t.table.rows[i]}</td>
                                        <td className="p-6 text-center">{row.c1 ? <Check className="mx-auto text-emerald-500 bg-emerald-100 rounded-full p-1 w-6 h-6" /> : <X className="mx-auto text-slate-300 w-5 h-5" />}</td>
                                        <td className="p-6 text-center">{row.c2p ? <Check className="mx-auto text-blue-500 bg-blue-100 rounded-full p-1 w-6 h-6" /> : <X className="mx-auto text-slate-300 w-5 h-5" />}</td>
                                        <td className="p-6 text-center">{row.c3p ? <Check className="mx-auto text-slate-600 bg-slate-200 rounded-full p-1 w-6 h-6" /> : <X className="mx-auto text-slate-300 w-5 h-5" />}</td>
                                        <td className="p-6 text-center">{row.c3 ? <Check className="mx-auto text-slate-400 bg-slate-100 rounded-full p-1 w-6 h-6" /> : <X className="mx-auto text-slate-300 w-5 h-5" />}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* 3. Scenario Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {t.cards.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 shadow-md border border-slate-100 hover:shadow-xl transition group rounded-sm"
                        >
                            <h3 className="text-xl font-bold mb-2 font-thai">{card.title}</h3>
                            <p className="text-slate-500 mb-4 text-sm font-thai">{card.desc}</p>
                            <div className="flex gap-2 flex-wrap">
                                {card.badges.map((b, j) => (
                                    <span key={j} className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded-sm font-thai">{b}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sticky CTA - Sharp */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/apply')}
                        className="bg-emerald-600 text-white font-bold py-3 px-8 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 hover:bg-emerald-500 transition border border-emerald-400 w-full rounded-sm font-thai"
                    >
                        <Zap fill="currentColor" size={18} /> {t.btn}
                    </motion.button>
                </div>

            </div>
        </div>
    );
};

export default InsuranceInfo;
