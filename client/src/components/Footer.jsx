import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

const Footer = ({ lang = 'EN' }) => {
    const year = new Date().getFullYear();

    const text = {
        EN: {
            desc: "Your trusted local partner for comprehensive insurance coverage. Combining international standards with neighborly care since 2010.",
            quick_links: "Quick Links",
            links: [
                { name: 'About Us', path: '/about' },
                { name: 'Our Policies', path: '/policies' },
                { name: 'Claims Center', path: '/claims' },
                { name: 'Contact Support', path: '/contact' }
            ],
            stay_updated: "Stay Updated",
            newsletter_desc: "Get the latest traffic news and tax saving tips.",
            email_placeholder: "Email address",
            rights: "Chonburi Insurance Broker. All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service",
            license: "License No. 6404001234"
        },
        TH: {
            desc: "เพื่อนคู่คิดด้านประกันภัยที่เชื่อถือได้ในท้องถิ่นของคุณ ผสานมาตรฐานสากลเข้ากับการดูแลดุจเพื่อนบ้าน ตั้งแต่ปี 2010",
            quick_links: "เมนูลัด",
            links: [
                { name: 'เกี่ยวกับเรา', path: '/about' },
                { name: 'แผนประกันภัย', path: '/policies' },
                { name: 'ศูนย์เคลม', path: '/claims' },
                { name: 'ติดต่อเรา', path: '/contact' }
            ],
            stay_updated: "ติดตามข่าวสาร",
            newsletter_desc: "รับข่าวสารจราจรและเคล็ดลับลดหย่อนภาษีล่าสุด",
            email_placeholder: "ระบุอีเมลของคุณ",
            rights: "ชลบุรี อินชัวร์รันส์ โบรคเกอร์ สงวนลิขสิทธิ์",
            privacy: "นโยบายความเป็นส่วนตัว",
            terms: "เงื่อนไขการให้บริการ",
            license: "ใบอนุญาตเลขที่ 6404001234"
        }
    };

    const t = text[lang] || text.EN;

    return (
        <footer className="relative bg-zinc-900 border-t border-white/10 text-zinc-400 font-thai overflow-hidden">
            {/* Decor Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 p-2 rounded-sm text-white">
                                <ShieldCheck size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                                CHONBURI <span className="text-emerald-500">INSURE</span>
                            </h2>
                        </div>
                        <p className="text-zinc-500 max-w-sm leading-relaxed">
                            {t.desc}
                        </p>
                        <div className="flex gap-4 pt-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="bg-white/5 p-3 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold tracking-wider uppercase text-sm">{t.quick_links}</h3>
                        <ul className="space-y-4">
                            {t.links.map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact or Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-white font-bold tracking-wider uppercase text-sm">{t.stay_updated}</h3>
                        <p className="text-sm">{t.newsletter_desc}</p>
                        <div className="flex bg-white/5 border border-white/10 rounded-sm p-1 focus-within:border-emerald-500/50 transition-colors">
                            <input
                                type="email"
                                placeholder={t.email_placeholder}
                                className="bg-transparent border-none text-white text-sm px-3 w-full focus:outline-none placeholder:text-zinc-600 font-thai"
                            />
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-sm transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="space-y-2 pt-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-emerald-500" /> <span>038-123-456</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-emerald-500" /> <span>contact@chonburi-insure.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-emerald-500" /> <span>Muang District, Chonburi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-600">
                    <p>&copy; {year} {t.rights}</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-zinc-400">{t.privacy}</a>
                        <a href="#" className="hover:text-zinc-400">{t.terms}</a>
                        <span className="flex items-center gap-2 text-emerald-900/40">
                            {t.license}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
