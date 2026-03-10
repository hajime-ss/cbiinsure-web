import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Shield, ChevronLeft, Loader2, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const QuoteResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lang } = useOutletContext();
    
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Retrieve the car data passed from the Home page dropdowns
    const searchData = location.state || null;

    useEffect(() => {
        if (!searchData) {
            navigate('/');
            return;
        }

        const fetchQuotes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/quotes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(searchData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    setQuotes(data.data);
                } else {
                    setError('Unable to retrieve live quotes at this time.');
                }
            } catch (err) {
                setError('Failed to connect to the quoting engine.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [searchData, navigate]);

    if (!searchData) return null;

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center text-zinc-500 hover:text-emerald-600 mb-4 transition font-thai">
                        <ChevronLeft size={20} />
                        {lang === 'TH' ? 'กลับไปแก้ไขรถยนต์' : 'Back to Edit Car'}
                    </button>
                    <h1 className="text-3xl font-bold text-zinc-900 font-display flex items-center gap-3">
                        <Search className="text-emerald-500" />
                        {lang === 'TH' ? 'ผลการค้นหาเบี้ยประกันของคุณ' : 'Your Insurance Search Results'}
                    </h1>
                    <p className="text-zinc-500 mt-2 font-thai text-lg">
                        {searchData.year} {searchData.brand} {searchData.model} {searchData.submodel}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar Filters (Mock) */}
                    <div className="lg:col-span-1 hidden lg:block space-y-6">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-zinc-200">
                            <h3 className="font-bold text-zinc-900 mb-4 font-thai">{lang === 'TH' ? 'ประเภทประกัน' : 'Insurance Class'}</h3>
                            <div className="space-y-2">
                                {['ตัณ 1 (Class 1)', 'ชั้น 2+ (Class 2+)', 'ชั้น 3+ (Class 3+)', 'ชั้น 3 (Class 3)'].map((c, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" defaultChecked />
                                        <span className="text-zinc-600 font-thai text-sm">{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Loading / Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
                                <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                                <h3 className="font-bold text-xl text-zinc-900 font-thai animate-pulse">
                                    {lang === 'TH' ? 'กำลังดึงฐานข้อมูลแบบเรียลไทม์...' : 'Fetching live database rates...'}
                                </h3>
                                <p className="text-zinc-500 mt-2 font-thai">
                                    {lang === 'TH' ? 'ระบบกำลังประมวลผลข้อเสนอที่ดีที่สุดสำหรับรถของคุณ' : 'Processing the best offers for your vehicle.'}
                                </p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 text-red-600 rounded-lg p-6 border border-red-200">
                                <h3 className="font-bold">{error}</h3>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-zinc-500 font-thai mb-4">
                                    {lang === 'TH' ? `พบ ${quotes.length} แผนที่ตรงกับรถของคุณ` : `Found ${quotes.length} plans matching your vehicle`}
                                </p>
                                
                                {quotes.map((quote, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx} 
                                        className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-lg font-bold text-xs">
                                            {quote.type}
                                        </div>
                                        
                                        <div className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-zinc-50 rounded-lg border border-zinc-100 p-2">
                                            {/* We simulate generic logos since we scraped generic data */}
                                            <div className="text-center">
                                                <Shield className="mx-auto text-emerald-600 mb-2" size={32} />
                                                <span className="text-xs font-bold text-zinc-600 font-thai text-center break-words leading-tight">{quote.company}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm font-thai">
                                            <div>
                                                <span className="block text-zinc-400 text-xs mb-1">ซ่อมรถเรา</span>
                                                <span className="font-bold text-zinc-900">{quote.coverage.property}</span>
                                            </div>
                                            <div>
                                                <span className="block text-zinc-400 text-xs mb-1">รักษาพยาบาล</span>
                                                <span className="font-bold text-zinc-900">{quote.coverage.medical}</span>
                                            </div>
                                            <div>
                                                <span className="block text-zinc-400 text-xs mb-1">ประกันตัวผู้ขับขี่</span>
                                                <span className="font-bold text-zinc-900">{quote.coverage.bail}</span>
                                            </div>
                                            <div>
                                                <span className="block text-zinc-400 text-xs mb-1">ประเภทอู่</span>
                                                <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle size={14}/> {quote.garageType}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-shrink-0 w-full md:w-48 text-center md:text-right md:border-l border-zinc-200 md:pl-6">
                                            <span className="block text-zinc-500 text-xs font-thai mb-1">{lang === 'TH' ? 'เบี้ยประกัน' : 'Premium'}</span>
                                            <span className="block text-3xl font-display font-bold text-amber-500 mb-4">
                                                ฿{quote.price.toLocaleString()}
                                            </span>
                                            <button onClick={() => navigate('/apply')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-md transition font-thai text-sm">
                                                {lang === 'TH' ? 'ซื้อเลย' : 'BUY NOW'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuoteResults;
