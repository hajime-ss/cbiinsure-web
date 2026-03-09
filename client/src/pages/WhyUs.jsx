import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Clock, Award, CheckCircle } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const WhyUs = () => {
    const { lang } = useOutletContext();

    const text = {
        EN: {
            title: "Why Choose Chonburi Insurance?",
            subtitle: "Your trusted neighbor in protection.",
            sections: [
                {
                    title: "Local Reliability",
                    desc: "We aren't just an insurance agency; we are your neighbors. We deeply understand the Chonburi area and the local driving lifestyle. This expertise allows us to recommend plans that are both cost-effective and provide the best coverage for your specific needs.",
                    icon: Users
                },
                {
                    title: "Transparency & Trust",
                    desc: "Customer trust is our core value. Honesty comes first. We explain every policy detail clearly without hidden terms, ensuring that when the unexpected happens, you receive the protection you were promised.",
                    icon: ShieldCheck
                },
                {
                    title: "Full-Service Excellence",
                    desc: "From comparing Class 1, 2+, or 3 premiums to handling your mandatory CTPL (Por Ror Bor) and road tax, we provide a one-stop service. Our team is ready to provide fast consultation and claim coordination for your peace of mind.",
                    icon: Clock
                },
                {
                    title: "Trusted Partners",
                    desc: "We handpick only the most stable and reputable insurance companies in Thailand, guaranteeing that our clients receive international service standards and financial security.",
                    icon: Award
                }
            ],
            partners_title: "Our Trusted Partners",
            reviews_title: "What Our Neighbors Say",
            team_title: "Meet Our Team",
            team: [
                { name: "Chairoj", role: "Insurance Specialist", img: "/team/chairoj.png" },
                { name: "Fay", role: "Insurance Specialist", img: "/team/fay.png" },
                { name: "Mild", role: "Insurance Specialist" }
            ]
        },
        TH: {
            title: "ทำไมต้อง Chonburi Insure",
            subtitle: "เคียงข้างคุณด้วยความอุ่นใจและเป็นกันเอง",
            sections: [
                {
                    title: "ความเชี่ยวชาญในพื้นที่",
                    desc: "เราไม่ใช่เพียงตัวแทนประกันภัย แต่เราคือเพื่อนบ้านที่เข้าใจคนชลบุรีอย่างแท้จริง มั่นใจได้ว่าคุณจะได้รับคำแนะนำที่เหมาะสมที่สุดสำหรับการใช้ชีวิตในชลบุรี",
                    icon: Users
                },
                {
                    title: "โปร่งใสและน่าเชื่อถือ",
                    desc: "ความไว้วางใจของคุณคือหัวใจสำคัญ เรายึดมั่นในความซื่อสัตย์เป็นอันดับหนึ่ง ทุกรายละเอียดกรมธรรม์ชัดเจน ไม่มีเงื่อนไขแอบแฝง",
                    icon: ShieldCheck
                },
                {
                    title: "บริการครบวงจรระดับมืออาชีพ",
                    desc: "ดูแลครบทุกขั้นตอน ตั้งแต่การเปรียบเทียบแผนประกันภัย จนถึงการต่อภาษี พร้อมทีมงานที่พร้อมช่วยเหลือคุณตลอดเส้นทาง",
                    icon: Clock
                },
                {
                    title: "พันธมิตรบริษัทชั้นนำ",
                    desc: "เราคัดสรรเฉพาะบริษัทประกันภัยที่มั่นคงและมีมาตรฐานสูงสุด เพื่อให้คุณมั่นใจในความคุ้มครองที่ได้รับ",
                    icon: Award
                }
            ],
            partners_title: "พันธมิตรชั้นนำของเรา",
            reviews_title: "เสียงสะท้อนจากลูกค้า",
            team_title: "ทีมงานมืออาชีพของเรา",
            team: [
                { name: "คุณชัยโรจน์", role: "นายหน้าประกันวินาศภัยชำนาญการ", img: "/team/chairoj.png" },
                { name: "คุณฝ้าย", role: "นายหน้าประกันวินาศภัยชำนาญการ", img: "/team/fay.png" },
                { name: "น้องมายด์", role: "นายหน้าประกันวินาศภัยชำนาญการ" }
            ]
        }
    };

    const t = text[lang] || text.EN;

    return (
        <div className="min-h-screen pb-20 pt-10">
            {/* Header */}
            <div className="text-center pt-16 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-36 h-36 mx-auto mb-6 bg-white rounded-full p-1 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-amber-500/20">
                        <img src="/logo_new.jpg" alt="Chonburi Insure" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-black drop-shadow-md font-display font-thai">
                        {t.title}
                    </h1>
                    <p className="text-xl text-blue-100 font-thai">{t.subtitle}</p>
                </motion.div>
            </div>

            <div className="max-w-5xl mx-auto px-4 space-y-24">

                {/* 4 Core Values */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {t.sections.map((sec, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 hover:border-amber-400/50 transition duration-500 group rounded-sm shadow-xl"
                        >
                            <div className="w-14 h-14 bg-amber-500/20 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition rounded-sm">
                                <sec.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-thai">{sec.title}</h3>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light font-thai">
                                {sec.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Team */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/5 border border-white/10 p-10 backdrop-blur-md rounded-sm"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-10 font-thai">{t.team_title}</h2>
                    <div className="flex flex-wrap justify-center gap-10">

                        {t.team.map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-32 h-32 bg-zinc-800 mx-auto mb-4 border-2 border-amber-500/50 flex items-center justify-center overflow-hidden rounded-full shadow-lg">
                                    {member.img ? (
                                        <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Users size={48} className="text-zinc-600" />
                                    )}
                                </div>
                                <h4 className="text-white font-bold text-lg font-thai">{member.name}</h4>
                                <p className="text-zinc-400 text-sm font-thai">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Partners Logo Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-12 font-thai">{t.partners_title}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-10">
                        {[
                            "/partners/deves.png",
                            "/partners/diamond.png",
                            "/partners/muangthai.png",
                            "/partners/navakij.jpg",
                            "/partners/indara.png",
                            "/partners/allianz.png"
                        ].map((src, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-4 rounded-sm shadow-xl hover:-translate-y-1 transition-transform"
                            >
                                <img src={src} alt="Partner" className="h-14 w-auto object-contain" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white text-slate-900 p-8 relative shadow-xl rounded-sm"
                        >
                            <div className="absolute top-4 right-4 text-emerald-500">
                                <CheckCircle />
                            </div>
                            <h3 className="font-bold mb-4 font-thai">{t.reviews_title}</h3>
                            <p className="italic text-lg mb-4">"Fast service in Chonburi. Renewed my tax in 10 minutes!"</p>
                            <div className="font-bold">- K. Somchai</div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default WhyUs;
