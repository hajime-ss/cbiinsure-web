import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
    const { lang } = useOutletContext();

    const content = {
        EN: {
            title: "Contact Us",
            subtitle: "We'd love to hear from you.",
            info_title: "Get in Touch",
            address: "123 Sukhumvit Road, Muang District, Chonburi 20000",
            hours: "Mon - Fri: 08:30 - 17:30",
            form: {
                name: "Your Name",
                email: "Email Address",
                message: "Message",
                btn: "Send Message"
            }
        },
        TH: {
            title: "ติดต่อเรา",
            subtitle: "เรายินดีรับฟังข้อเสนอแนะจากคุณ",
            info_title: "ช่องทางการติดต่อ",
            address: "123 ถ.สุขุมวิท อ.เมือง จ.ชลบุรี 20000",
            hours: "จันทร์ - ศุกร์: 08:30 - 17:30",
            form: {
                name: "ชื่อของคุณ",
                email: "อีเมล",
                message: "ข้อความ",
                btn: "ส่งข้อความ"
            }
        },
        ZH: {
            title: "联系我们",
            subtitle: "我们很乐意听取您的意见。",
            info_title: "获取联系",
            address: "123 Sukhumvit Road, Muang District, Chonburi 20000",
            hours: "周一 - 周五: 08:30 - 17:30",
            form: {
                name: "您的姓名",
                email: "电子邮件",
                message: "留言",
                btn: "发送信息"
            }
        }
    };

    const t = content[lang] || content.EN;

    return (
        <div className="min-h-screen pt-24 pb-12 relative bg-zinc-900 overflow-hidden">
            {/* Background Map Effect (Abstract) */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center grayscale pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Left: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10 pt-10"
                    >
                        <div>
                            <h1 className="text-5xl font-bold text-white mb-4 font-thai">{t.title}</h1>
                            <p className="text-xl text-zinc-400 font-thai">{t.subtitle}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1 font-thai">Visit Us</h3>
                                    <p className="text-zinc-400 max-w-xs font-thai">{t.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1 font-thai">Call Us</h3>
                                    <p className="text-zinc-400">038-123-456</p>
                                    <p className="text-zinc-500 text-sm">Fax: 038-123-457</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1 font-thai">Office Hours</h3>
                                    <p className="text-zinc-400 font-thai">{t.hours}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-premium p-10 relative"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2 font-thai">{t.form.name}</label>
                                <input type="text" className="input-sharp font-thai" placeholder="" />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2 font-thai">{t.form.email}</label>
                                <input type="email" className="input-sharp font-thai" placeholder="" />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2 font-thai">{t.form.message}</label>
                                <textarea rows="4" className="input-sharp font-thai" placeholder=""></textarea>
                            </div>
                            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-sm transition-all flex items-center justify-center gap-2 font-thai shadow-lg hover:shadow-emerald-500/20">
                                <Send size={18} />
                                {t.form.btn}
                            </button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
