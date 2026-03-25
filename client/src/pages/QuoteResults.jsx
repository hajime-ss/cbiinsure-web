import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Shield, ChevronLeft, Loader2, Search, CheckCircle, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const QuoteResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lang } = useOutletContext();
    
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (company) => {
        setExpandedGroups(prev => ({
            ...prev,
            [company]: prev[company] === false ? true : false
        }));
    };

    // Sidebar Filter States (Exact ANC Match)
    const [filterClass, setFilterClass] = useState('ชั้น 1');
    const [filterSumInsured, setFilterSumInsured] = useState('ทุนทั้งหมด');
    const [filterGarage, setFilterGarage] = useState('ทั้งหมด');
    const [filterDeductible, setFilterDeductible] = useState('ทั้งหมด');
    const [filterProvince, setFilterProvince] = useState('ทั้งหมด');

    // Retrieve the car data passed from the Home page dropdowns
    const searchData = location.state || null;

    const sumInsuredRanges = [
        { label: 'ทั้งหมด (All)', value: 'ทั้งหมด' },
        { label: 'ต่ำกว่า 100,000', value: '0-100000' },
        { label: '100,000 - 200,000', value: '100000-200000' },
        { label: '200,000 - 300,000', value: '200000-300000' },
        { label: '300,000 - 400,000', value: '300000-400000' },
        { label: '400,000 - 500,000', value: '400000-500000' },
        { label: '500,000 - 600,000', value: '500000-600000' },
        { label: '600,000 - 700,000', value: '600000-700000' },
        { label: '700,000 - 800,000', value: '700000-800000' },
        { label: '800,000 - 900,000', value: '800000-900000' },
        { label: '900,000 - 1,000,000', value: '900000-1000000' },
        { label: '1,000,000 - 2,000,000', value: '1000000-2000000' },
        { label: '2,000,000 - 3,000,000', value: '2000000-3000000' },
        { label: '3,000,000 - 4,000,000', value: '3000000-4000000' },
        { label: '4,000,000 - 5,000,000', value: '4000000-5000000' },
        { label: '5,000,000 - 6,000,000', value: '5000000-6000000' },
        { label: '6,000,000 - 7,000,000', value: '6000000-7000000' },
        { label: '7,000,000 - 8,000,000', value: '7000000-8000000' },
    ];

    // Derived State for Filtering Quotes
    const filteredQuotes = quotes.filter((q) => {
        // Class Match
        if (filterClass !== 'ชั้น 1' && q.type !== filterClass) return true; // Loosely keeping all right now if not fully scraped types, adjusting logic

        // Garage Match
        if (filterGarage !== 'ทั้งหมด') {
            if (filterGarage === 'ห้าง' && q.garage !== 'ห้าง') return false;
            if (filterGarage === 'อู่' && q.garage !== 'อู่') return false;
        }

        // Sum Insured Bracket Match
        if (filterSumInsured !== 'ทั้งหมด') {
            const rawVal = q.sumInsured ? q.sumInsured.replace(/,/g, '').trim() : '';
            const sumVal = parseInt(rawVal, 10);
            if (!isNaN(sumVal)) {
                const [min, max] = filterSumInsured.split('-').map(Number);
                if (sumVal < min || sumVal > max) return false;
            }
        }

        // Deductible Match
        if (filterDeductible !== 'ทั้งหมด') {
            if (q.deductible !== 'ไม่มีค่าเสียหายส่วนแรก') return false;
        }

        // Province Match
        if (filterProvince !== 'ทั้งหมด') {
            if (q.province !== filterProvince && q.province !== 'ทั้งหมด') return false;
        }
        
        return true;
    });

    useEffect(() => {
        if (!searchData) {
            navigate('/');
            return;
        }

        const fetchQuotes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/quotes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...searchData,
                        filterClass
                    })
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
    }, [searchData, filterClass, navigate]);

    if (!searchData) return null;

    return (
        <div className="min-h-screen bg-zinc-50 pt-24 pb-12 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center text-zinc-500 hover:text-blue-600 mb-4 transition font-thai">
                        <ChevronLeft size={20} />
                        {lang === 'TH' ? 'กลับไปหน้าหลัก' : 'Back to Home'}
                    </button>
                    <h1 className="text-2xl font-bold text-zinc-700 font-thai flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 opacity-50 grayscale" onError={(e) => e.target.style.display='none'} />
                        {lang === 'TH' ? 'ประกันภัยรถยนต์' : 'Car Insurance'} <span className="text-blue-600">ประเภท 1</span> {searchData.brand} {searchData.model} {searchData.submodel} {searchData.year}
                    </h1>
                    <p className="text-zinc-500 mt-2 font-thai text-sm bg-zinc-100 p-2 rounded-md">
                        {lang === 'TH' ? 'รายการ ประกันภัยรถยนต์ ประเภท 1 ทุกบริษัทประกันราคาพิเศษ คุ้มครองครอบคลุมทุกความเสี่ยง ทั้งชน รถหาย ไฟไหม้ เหมาะกับผู้ที่ใช้รถเป็นประจำและหมดกังวลทุกการขับขี่' : 'Comprehensive Class 1 Insurance protecting against all risks including collision, theft, and fire.'}
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar Filters (Mock) */}
                    {/* Exact ANC Broker Sidebar UI */}
                    <div className="lg:col-span-1 hidden lg:block">
                        <div className="bg-[#e9e9e9] rounded-sm overflow-hidden border border-zinc-300">
                            {/* Header */}
                            <div className="bg-[#3498db] text-white p-3 flex justify-between items-center cursor-pointer">
                                <span className="font-thai font-bold flex items-center gap-2">
                                    <Search size={16} /> {lang === 'TH' ? 'กรองข้อมูล' : 'Filter Data'}
                                </span>
                                <ChevronLeft size={16} />
                            </div>

                            {/* Filters Container */}
                            <div className="p-0">
                                {/* 1. Insurance Class */}
                                <div className="border-b border-white/50">
                                    <div className="p-2 font-thai font-bold text-sm text-zinc-700 bg-[#e0e0e0] flex items-center justify-between">
                                        <span>≡ {lang === 'TH' ? 'ประเภทประกัน' : 'Class'}</span>
                                    </div>
                                    <div className="grid grid-cols-4 text-center text-xs font-thai border-t border-white">
                                        {['ชั้น 1', 'ชั้น 2+', 'ชั้น 3+', 'ชั้น 3'].map((cls) => (
                                            <div 
                                                key={cls}
                                                onClick={() => setFilterClass(cls)}
                                                className={`py-2 cursor-pointer transition capitalize ${filterClass === cls ? 'bg-zinc-500 text-white font-bold shadow-inner' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                {cls === 'ชั้น 1' ? (lang === 'TH' ? 'ชั้น 1' : 'Type 1') : 
                                                 cls === 'ชั้น 2+' ? (lang === 'TH' ? 'ชั้น 2+' : 'Type 2+') : 
                                                 cls === 'ชั้น 3+' ? (lang === 'TH' ? 'ชั้น 3+' : 'Type 3+') : 
                                                 (lang === 'TH' ? 'ชั้น 3' : 'Type 3')}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Sum Insured */}
                                <div className="border-b border-white/50">
                                    <div className="p-2 font-thai font-bold text-sm text-zinc-700 bg-[#e0e0e0] flex items-center justify-between">
                                        <span>≡ {lang === 'TH' ? 'ช่วงทุนประกัน' : 'Sum Insured Range'}</span>
                                    </div>
                                    <div className="p-2 bg-white border-t border-white">
                                        <select 
                                            value={filterSumInsured}
                                            onChange={(e) => setFilterSumInsured(e.target.value)}
                                            className="w-full p-2 border border-zinc-300 rounded-sm text-sm font-thai text-zinc-700 outline-none focus:border-blue-500 transition cursor-pointer"
                                        >
                                            {sumInsuredRanges.map((range, idx) => (
                                                <option key={idx} value={range.value}>{range.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* 3. Garage Type */}
                                <div className="border-b border-white/50">
                                    <div className="p-2 font-thai font-bold text-sm text-zinc-700 bg-[#e0e0e0] flex items-center justify-between">
                                        <span>≡ {lang === 'TH' ? 'ซ่อม' : 'Garage'}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-center text-xs font-thai border-t border-white">
                                        {['ทั้งหมด', 'ห้าง', 'อู่'].map((garage) => (
                                            <div 
                                                key={garage}
                                                onClick={() => setFilterGarage(garage)}
                                                className={`py-2 cursor-pointer transition border-r border-zinc-200 last:border-0 ${filterGarage === garage ? 'bg-zinc-500 text-white font-bold shadow-inner' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                {garage === 'ทั้งหมด' ? (lang === 'TH' ? 'ทั้งหมด' : 'All') :
                                                 garage === 'ห้าง' ? (lang === 'TH' ? 'ห้าง' : 'Dealer') :
                                                 (lang === 'TH' ? 'อู่' : 'Garage')}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Deductible */}
                                <div className="border-b border-white/50">
                                    <div className="p-2 font-thai font-bold text-sm text-zinc-700 bg-[#e0e0e0] flex items-center justify-between">
                                        <span>≡ {lang === 'TH' ? 'ค่าเสียหายส่วนแรก' : 'Deductible'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 text-center text-xs font-thai border-t border-white">
                                        {['ทั้งหมด', 'ไม่มีค่าเสียหายส่วนแรก'].map((deduct) => (
                                            <div 
                                                key={deduct}
                                                onClick={() => setFilterDeductible(deduct)}
                                                className={`py-2 px-1 flex items-center justify-center cursor-pointer transition border-r border-zinc-200 last:border-0 ${filterDeductible === deduct ? 'bg-zinc-500 text-white font-bold shadow-inner text-[10px]' : 'bg-white text-zinc-700 hover:bg-zinc-50 text-[10px]'}`}
                                            >
                                                {deduct === 'ทั้งหมด' ? (lang === 'TH' ? 'ทั้งหมด' : 'All') : (lang === 'TH' ? 'ไม่มีค่าเสียหายส่วนแรก' : 'No Deductible')}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 5. Province */}
                                <div>
                                    <div className="p-2 font-thai font-bold text-sm text-zinc-700 bg-[#e0e0e0] flex items-center justify-between">
                                        <span>≡ {lang === 'TH' ? 'เบี้ยทะเบียนต่างจังหวัด' : 'Province'}</span>
                                    </div>
                                    <div className="grid grid-cols-3 text-center text-[10px] font-thai border-t border-white">
                                        {['ทั้งหมด', 'กทม.และปริมณฑล', 'ต่างจังหวัด'].map((prov) => (
                                            <div 
                                                key={prov}
                                                onClick={() => setFilterProvince(prov)}
                                                className={`py-2 px-1 flex items-center justify-center cursor-pointer transition border-r border-zinc-200 last:border-0 ${filterProvince === prov ? 'bg-zinc-500 text-white font-bold shadow-inner' : 'bg-white text-zinc-700 hover:bg-zinc-50'}`}
                                            >
                                                {prov === 'ทั้งหมด' ? (lang === 'TH' ? 'ทั้งหมด' : 'All') :
                                                 prov === 'กทม.และปริมณฑล' ? (lang === 'TH' ? 'กทม.และปริมณฑล' : 'BKK & Vicinity') :
                                                 (lang === 'TH' ? 'ต่างจังหวัด' : 'Upcountry')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                {Object.values(
                                    filteredQuotes.reduce((acc, quote) => {
                                        if (!acc[quote.company]) {
                                            acc[quote.company] = {
                                                company: quote.company,
                                                companyTh: quote.companyTh,
                                                companyEn: quote.companyEn,
                                                companyAbbr: quote.companyAbbr,
                                                companyLogo: quote.companyLogo,
                                                minDealerPrice: null,
                                                minGaragePrice: null,
                                                quotes: []
                                            };
                                        }
                                        acc[quote.company].quotes.push(quote);
                                        if (quote.garage === 'ห้าง') {
                                            if (!acc[quote.company].minDealerPrice || quote.price < acc[quote.company].minDealerPrice) acc[quote.company].minDealerPrice = quote.price;
                                        } else if (quote.garage === 'อู่') {
                                            if (!acc[quote.company].minGaragePrice || quote.price < acc[quote.company].minGaragePrice) acc[quote.company].minGaragePrice = quote.price;
                                        }
                                        return acc;
                                    }, {})
                                ).map((group, groupIdx) => {
                                    const isExpanded = expandedGroups[group.company] !== false; // expanded by default
                                    return (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: groupIdx * 0.1 }}
                                            key={groupIdx} 
                                            className="bg-white border text-left border-[#e0e0e0] flex flex-col relative w-full shadow-sm rounded-sm overflow-hidden"
                                        >
                                            {/* Company Header Row */}
                                            <div 
                                                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white cursor-pointer hover:bg-zinc-50 transition border-l-4 border-[#3498db]"
                                                onClick={() => toggleGroup(group.company)}
                                            >
                                                {/* Left: Logo & Company */}
                                                <div className="flex items-center gap-4 w-full md:w-1/2">
                                                    <div className="w-12 h-12 rounded-full border border-zinc-200 overflow-hidden flex items-center justify-center bg-white shrink-0">
                                                        <img src={group.companyLogo} alt={group.company} className="w-[85%] h-[85%] object-contain" 
                                                             onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
                                                        />
                                                        <div className="w-full h-full bg-blue-900 text-white hidden items-center justify-center font-bold text-lg rounded-full">
                                                            {group.companyAbbr || group.company.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <span className="font-thai font-bold text-zinc-800 text-lg md:text-xl">
                                                        {lang === 'TH' ? group.companyTh : group.companyEn}
                                                    </span>
                                                </div>

                                                {/* Right: Summary Pills & Arrow */}
                                                <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0 ml-auto w-full md:w-auto justify-start md:justify-end">
                                                    {group.minDealerPrice && (
                                                        <div className="flex items-center border border-emerald-500 rounded-full px-3 md:px-4 py-1.5 bg-white">
                                                            <span className="text-emerald-500 text-[10px] md:text-xs font-thai mr-2">ห้าง</span>
                                                            <span className="text-emerald-600 font-bold text-sm md:text-base">{group.minDealerPrice.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {group.minGaragePrice && (
                                                        <div className="flex items-center border border-orange-500 rounded-full px-3 md:px-4 py-1.5 bg-white">
                                                            <span className="text-orange-500 text-[10px] md:text-xs font-thai mr-2">อู่</span>
                                                            <span className="text-orange-600 font-bold text-sm md:text-base">{group.minGaragePrice.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3498db] hover:bg-[#2980b9] rounded text-white flex items-center justify-center transition shrink-0 ml-2">
                                                        <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Packages Expanded List */}
                                            {isExpanded && (
                                                <div className="bg-[#fcfcfc] border-t border-zinc-200 flex flex-col px-2 py-2 md:px-4 md:py-3 gap-2">
                                                    {group.quotes.map((quote, idx) => (
                                                        <div key={idx} className="flex flex-col md:flex-row border border-zinc-200 bg-white hover:border-[#3498db] transition rounded p-4 relative shadow-sm items-start md:items-center justify-between">
                                                            
                                                            {/* Block 1: Plus, Badge, Package Name, Sum Insured */}
                                                            <div className="flex items-start md:items-center gap-4 w-full md:w-3/4">
                                                                <button className="w-6 h-6 md:w-7 md:h-7 shrink-0 border border-zinc-400 rounded-full text-zinc-500 flex items-center justify-center text-sm md:text-xl leading-none hover:bg-zinc-100 hover:text-black mt-1 md:mt-0 transition font-light pb-0.5"><Plus size={16} /></button>
                                                                
                                                                <div className="flex flex-col items-center shrink-0 w-[60px] md:w-[70px]">
                                                                    {quote.garage === 'ห้าง' ? (
                                                                        <div className="border border-emerald-500 bg-emerald-50/10 rounded-full px-3 py-0.5 w-full text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                                                            <span className="text-emerald-500 font-thai text-[10px] md:text-xs font-medium">ห้าง</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="border border-orange-500 bg-orange-50/10 rounded-full px-3 py-0.5 w-full text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                                                            <span className="text-orange-500 font-thai text-[10px] md:text-xs font-medium">อู่</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex text-yellow-400 text-[8px] md:text-[10px] mt-1 space-x-[1px]">
                                                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col font-thai flex-1 pl-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-zinc-800 font-bold text-sm md:text-base leading-tight">
                                                                            {lang === 'TH' ? quote.companyTh : quote.companyEn} {quote.type} {quote.garage}
                                                                        </span>
                                                                    </div>
                                                                    {quote.packageName && (
                                                                        <div className="mt-1 text-zinc-500 text-[11px] md:text-[12px] font-medium break-words leading-tight">
                                                                            {lang === 'TH' ? 'แพ็กเกจ:' : 'Package:'} <span className="text-[#3498db] font-bold">{quote.packageName}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-wrap items-center mt-1.5 gap-2">
                                                                        <span className="text-zinc-600 font-medium text-[11px] md:text-[13px] bg-zinc-100/80 border border-zinc-200 px-2 py-0.5 rounded">ทุน {quote.sumInsured}</span>
                                                                        <span className="text-zinc-600 font-medium text-[11px] md:text-[13px] bg-zinc-100/80 border border-zinc-200 px-2 py-0.5 rounded">{quote.deductible}</span>
                                                                    </div>
                                                                    <span className="text-zinc-400 text-[10px] md:text-xs mt-1.5 underline cursor-pointer hover:text-[#3498db] transition w-fit">ดูความคุ้มครอง / หมายเหตุเงื่อนไข</span>
                                                                </div>
                                                            </div>

                                                            {/* Block 2: Price and Action */}
                                                            <div className="flex items-center justify-between w-full md:w-auto md:justify-end mt-4 md:mt-0 gap-4 pl-[4.5rem] md:pl-0 border-t border-zinc-100 md:border-0 pt-3 md:pt-0">
                                                                <div className="flex flex-col items-end">
                                                                    {quote.garage === 'ห้าง' ? (
                                                                        <span className="text-emerald-500 font-bold text-xl md:text-2xl">฿{quote.price.toLocaleString()}</span>
                                                                    ) : (
                                                                        <span className="text-orange-500 font-bold text-xl md:text-2xl">฿{quote.price.toLocaleString()}</span>
                                                                    )}
                                                                    <button className="text-zinc-500 hover:text-orange-500 bg-white border border-zinc-300 hover:border-orange-500 rounded-full px-5 py-0.5 text-[10px] md:text-xs font-thai transition mt-1">
                                                                        {lang === 'TH' ? 'เพิ่มเติม' : 'Details'}
                                                                    </button>
                                                                </div>
                                                                <div 
                                                                    onClick={() => navigate('/apply')}
                                                                    className="bg-[#3498db] hover:bg-[#2980b9] text-white w-10 h-16 rounded flex items-center justify-center cursor-pointer shadow-sm transition shrink-0"
                                                                >
                                                                    <ChevronLeft size={24} className="rotate-180" />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QuoteResults;
