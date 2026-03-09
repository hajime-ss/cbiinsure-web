import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Target, Heart, Award, Users } from 'lucide-react';

const About = () => {
    const { lang } = useOutletContext();
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: scrollRef });

    // Parallax elements
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);

    const content = {
        EN: {
            title: "Our Story",
            subtitle: "More than just insurance. We are your neighbors.",
            timeline: [
                { year: "The Origin", title: "From A Bad Experience", desc: "It started when we were just policyholders ourselves. We realized that unclear information could cause major problems when accidents happen." },
                { year: "The Idea", title: "A Better Way", desc: "We believed insurance should be more than just selling paper. It must be a transparent risk management system that truly stands by the customer." },
                { year: "10+ Years", title: "Professional Growth", desc: "For over a decade, we have grown from a small operation to serving both Thai and international clients with over 30 leading partners." },
                { year: "Today", title: "Trust & Standard", desc: "We operate with a clear principle: 'If this were our own asset, what protection would we choose?'" }
            ],
            vision: {
                title: "Our Principles",
                cards: [
                    { title: "Transparency", desc: "Clear, direct information. We discuss pros, cons, and limitations so you can decide with confidence.", icon: Target },
                    { title: "Client First", desc: "We never upsell. We give the advice we would want for our own families.", icon: Heart },
                    { title: "Integrity", desc: "Honesty is our minimum standard. We take responsibility for our advice and service.", icon: Award },
                ]
            }
        },
        TH: {
            title: "เรื่องราวของเรา",
            subtitle: "จากประสบการณ์จริง สู่มาตรฐานการบริการที่ดีที่สุด",
            timeline: [
                { year: "จุดเริ่มต้น", title: "จากมุมของผู้เอาประกัน", desc: "เริ่มต้นจากประสบการณ์ตรงที่ทำให้เราเห็นว่า การขาดข้อมูลที่ชัดเจนสร้างผลกระทบมหาศาลเมื่อเกิดเหตุไม่คาดฝัน" },
                { year: "ความมุ่งมั่น", title: "มากกว่าการขาย", desc: "เราเชื่อมั่นว่าธุรกิจประกันควรเป็นระบบดูแลความเสี่ยงที่โปร่งใส และยืนอยู่ข้างลูกค้าอย่างแท้จริง" },
                { year: "กว่า 10 ปี", title: "เส้นทางมืออาชีพ", desc: "จากออฟฟิศเล็กๆ สู่ความไว้วางใจจากลูกค้าทั้งไทยและต่างชาติ ให้บริการร่วมกับกว่า 30 บริษัทชั้นนำ" },
                { year: "ปัจจุบัน", title: "มาตรฐานที่ไม่ลดละ", desc: "ทุกคำแนะนำตั้งอยู่บนหลักคิดเดียว: 'หากทรัพย์สินนั้นเป็นของเราเอง เราจะเลือกความคุ้มครองแบบใด'" }
            ],
            vision: {
                title: "หลักการทำงานของเรา",
                cards: [
                    { title: "ชัดเจน ตรงไปตรงมา", desc: "ให้ข้อมูลครบถ้วนทั้งข้อดีและข้อจำกัด เพื่อให้คุณตัดสินใจได้อย่างมั่นใจ", icon: Target },
                    { title: "ประโยชน์สูงสุดของลูกค้า", desc: "ไม่เน้นการขายแบบชี้นำ แต่เน้นความเข้าใจและการดูแลที่คุ้มค่าที่สุด", icon: Heart },
                    { title: "ซื่อสัตย์และรับผิดชอบ", desc: "พัฒนาความรู้อย่างต่อเนื่อง และให้บริการที่ตรวจสอบได้ เพราะความไว้ใจคือรากฐานของเรา", icon: Award },
                ]
            }
        },
        ZH: {
            title: "我们的故事",
            subtitle: "不仅仅是保险。我们是您的邻居。",
            timeline: [
                { year: "起源", title: "来自糟糕的经历", desc: "这一切始于当我们自己还是保单持有人时。我们意识到当事故发生时，不清晰的信息可能会造成大问题。" },
                { year: "理念", title: "更好的方式", desc: "我们坚信保险应该不仅仅是推销文件。它必须是一个透明的风险管理系统，真正与客户站在一起。" },
                { year: "10+ 年", title: "专业成长", desc: "十多年来，我们从一家小型公司成长为服务于泰国和国际客户的机构，拥有30多家领先的合作伙伴。" },
                { year: "今天", title: "信任与标准", desc: "我们秉持一个明确的原则：“如果这是我们自己的资产，我们会选择什么样的保障？”" }
            ],
            vision: {
                title: "我们的原则",
                cards: [
                    { title: "透明", desc: "清晰、直接的信息。我们在讨论优缺点和限制时透明，让您能自信地做出决定。", icon: Target },
                    { title: "客户至上", desc: "我们从不强行推销。我们提供的建议，就像我们为自己家人提供的一样。", icon: Heart },
                    { title: "诚信", desc: "诚实是我们的最低标准。我们对我们的建议和服务负责。", icon: Award },
                ]
            }
        }
    };

    const t = content[lang] || content.EN;

    return (
        <div ref={scrollRef} className="min-h-screen text-white relative">
            {/* Background */}
            <div className="fixed inset-0 z-[-1] bg-zinc-900">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Hero */}
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                <motion.div style={{ y: yHero }} className="z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-6 font-thai"
                    >
                        SINCE 2010
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent font-thai">
                        {t.title}
                    </h1>
                    <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto font-thai">
                        {t.subtitle}
                    </p>
                </motion.div>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="relative border-l-2 border-white/10 pl-8 md:pl-0 space-y-16">
                    {t.timeline.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.2 }}
                            className={`relative md:flex items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse text-right' : ''}`}
                        >
                            {/* Dot on line */}
                            <div className="absolute left-[-37px] md:left-1/2 md:translate-x-[-50%] w-4 h-4 bg-emerald-500 rounded-full border-4 border-zinc-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>

                            <div className="flex-1 md:w-1/2">
                                <span className="text-5xl font-bold text-white/5 absolute -top-10 left-0 md:left-auto md:right-0 select-none font-display z-0">
                                    {item.year}
                                </span>
                                <div className="relative z-10">
                                    <span className="text-emerald-400 font-bold text-xl block mb-2">{item.year}</span>
                                    <h3 className="text-2xl font-bold text-white mb-2 font-thai">{item.title}</h3>
                                    <p className="text-zinc-400 font-thai">{item.desc}</p>
                                </div>
                            </div>
                            <div className="hidden md:block flex-1"></div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Vision Cards */}
            <div className="py-24 px-6 bg-white/5 backdrop-blur-sm border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 font-thai">{t.vision.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {t.vision.cards.map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
                                className="glass-premium p-8 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <card.icon size={80} />
                                </div>
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                    <card.icon size={28} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-thai">{card.title}</h3>
                                <p className="text-zinc-400 font-thai leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
