import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight, Shield, Zap, Star, ArrowRight } from 'lucide-react';

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
        },
        ZH: {
            tagline: "春武里排名第一",
            title: "高级保障",
            subtitle: "泰国最值得信赖的保险代理",
            btn: "获取报价",
            stats: ["超过1万客户", "24/7 客户支持", "最优费率"],
            features: [
                { title: "全面保障", desc: "涵盖事故、盗窃和自然灾害的全面保护。", icon: Shield, img: "/features/comprehensive.jpg" },
                { title: "快速理赔", desc: "由我们的专属礼宾团队优先处理。", icon: Zap, img: "/features/fasttrack.jpg" },
                { title: "个性化", desc: "量身定制的计划，适合您的特定生活方式。", icon: Star, img: "/features/personalized.jpg" }
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
                    className="max-w-3xl text-center relative z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold px-4 py-1.5 mb-6 tracking-widest uppercase rounded-full shadow-lg shadow-emerald-900/20 font-thai"
                    >
                        {t.tagline}
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 font-display tracking-tight leading-[1.1] drop-shadow-2xl font-thai">
                        {t.title}
                    </h1>
                    <p className="text-zinc-200 text-lg md:text-xl font-light mb-10 tracking-wide font-thai max-w-xl mx-auto leading-relaxed">
                        {t.subtitle}
                    </p>

                    <button
                        onClick={() => navigate('/apply')}
                        className="group relative bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-4 px-10 text-lg flex items-center justify-center gap-3 mx-auto rounded-full font-thai shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {t.btn} <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                        <div className="absolute inset-0 rounded-full border border-white/40"></div>
                    </button>

                    <div className="mt-14 flex justify-center gap-8 border-t border-white/10 pt-8 opacity-90">
                        {t.stats.map((stat, i) => (
                            <div key={i} className="text-center px-4">
                                <span className="block text-white font-bold text-sm md:text-base font-thai tracking-wide">{stat}</span>
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
