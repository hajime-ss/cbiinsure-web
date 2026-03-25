import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronRight, CheckCircle } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useOutletContext, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const CustomerForm = () => {
    const { lang } = useOutletContext();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        carMake: '', carModel: '', carYear: '',
        notes: ''
    });
    const [files, setFiles] = useState([]);
    const [submissionId, setSubmissionId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const text = {
        EN: {
            title: "Start Your Coverage Application",
            validation_hint: "* All mandatory fields must be completed to proceed.",
            steps: ["Driver Details", "Vehicle Details", "Finalize"],
            step1_title: "Primary Driver Information",
            fields: { name: "Full Name (as per ID)", email: "Email Address", phone: "Mobile Number" },
            step2_title: "Vehicle Specifications",
            fields2: { make: "Vehicle Make", model: "Vehicle Model", year: "Registration Year" },
            step3_title: "Finalize & Submit",
            upload: "Drag & drop files or click to upload (Vehicle Registration Copy)",
            notes: "Additional requirements or remarks...",
            btn_next: "Next Step",
            btn_back: "Previous Step",
            btn_submit: "Submit Application",
            success_title: "Application Received Successfully",
            success_msg: "Our Dedicated Manager and AI System are reviewing your profile. We will present the optimal quotation shortly."
        },
        TH: {
            title: "เริ่มต้นรับความคุ้มครองระดับพรีเมียม",
            validation_hint: "* ข้อมูลที่จำเป็นทั้งหมดต้องกรอกให้ครบถ้วนเพื่อดำเนินการต่อ",
            steps: ["ข้อมูลผู้เอาประกัน", "ข้อมูลรถยนต์", "ยืนยันข้อมูล"],
            step1_title: "ข้อมูลผู้เอาประกันภัยหลัก",
            fields: { name: "ชื่อ-นามสกุล (ตามบัตรประชาชน)", email: "อีเมล", phone: "หมายเลขโทรศัพท์มือถือ" },
            step2_title: "ข้อมูลจำเพาะของรถยนต์",
            fields2: { make: "ยี่ห้อรถยนต์", model: "รุ่นรถยนต์", year: "ปีที่จดทะเบียนรถ" },
            step3_title: "ตรวจสอบและส่งข้อมูล",
            upload: "ลากและวางไฟล์ หรือคลิกเพื่ออัปโหลดเอกสาร (สำเนารายการจดทะเบียนรถยนต์)",
            notes: "ความต้องการเพิ่มเติม หรือหมายเหตุ...",
            btn_next: "ขั้นตอนถัดไป",
            btn_back: "ย้อนกลับ",
            btn_submit: "ส่งข้อมูลเพื่อขอใบเสนอราคา",
            success_title: "ได้รับข้อมูลการขอเอาประกันภัยเรียบร้อยแล้ว",
            success_msg: "เจ้าหน้าที่ที่ปรึกษาส่วนตัวและระบบ AI กำลังตรวจสอบข้อมูลของท่าน เพื่อจัดทำข้อเสนอที่ดีและคุ้มค่าที่สุด"
        }
    };

    const t = text[lang] || text.EN;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.name.trim()) newErrors.name = true;
            if (!formData.email.trim()) newErrors.email = true;
            if (!formData.phone.trim()) newErrors.phone = true;
        }

        if (currentStep === 2) {
            if (!formData.carMake.trim()) newErrors.carMake = true;
            if (!formData.carModel.trim()) newErrors.carModel = true;
            if (!formData.carYear.trim()) newErrors.carYear = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(s => s + 1);
        }
    };
    const prevStep = () => setStep(s => s - 1);

    const [user, setUser] = useState(null);

    // Auth & Persistence Check
    useEffect(() => {
        // Check for saved state
        const savedData = localStorage.getItem('pendingApplication');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(parsed.formData);
                setStep(parsed.step); // Usually 3 (Finalize)
                // Optional: We can't restore files easily, so we skip that or show a message
                localStorage.removeItem('pendingApplication'); // Clear it
            } catch (e) {
                console.error("Failed to restore form", e);
            }
        }
    }, []);

    // Monitor Auth for linking
    // Removed redundant import and comment block



    // Changing handleSubmit
    const handleSubmit = async () => {
        // 1. Check Auth
        const currentUser = auth.currentUser;
        if (!currentUser) {
            // Save state
            localStorage.setItem('pendingApplication', JSON.stringify({ formData, step: 3 }));
            // alert("Please login to submit your application. We have saved your progress.");
            navigate('/login?returnUrl=/apply');
            return;
        }

        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, "submissions"), {
                ...formData,
                userId: currentUser.uid, // Strictly link to account
                userEmail: currentUser.email, // Also link email for redundancy
                status: "PENDING",
                createdAt: serverTimestamp(),
                lang: lang
            });
            setSubmissionId(docRef.id);
            setStep(4);
            // Clear draft if success
            localStorage.removeItem('pendingApplication');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error submitting. Please try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pt-20">
            {/* Background Elements managed by Layout, just content here */}

            <div className="max-w-xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-premium p-8"
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 font-display text-white font-thai">
                            {t.title}
                        </h1>
                        <div className="flex gap-2 h-1 bg-zinc-800 rounded-full mt-4">
                            {[1, 2, 3].map(i => (
                                <motion.div
                                    key={i}
                                    className={clsx("h-full rounded-full transition-colors", i <= step ? "bg-emerald-500" : "bg-transparent")}
                                    initial={false}
                                    animate={{ width: i === step ? "50%" : "25%", flex: 1 }}
                                />
                            ))}
                        </div>
                        {Object.keys(errors).length > 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-xs mt-4 font-thai text-center font-bold"
                            >
                                {t.validation_hint}
                            </motion.p>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-semibold text-zinc-300 font-thai">{t.step1_title}</h2>
                                <input
                                    name="name"
                                    placeholder={t.fields.name}
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`input-sharp font-thai ${errors.name ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                />
                                <input
                                    name="email"
                                    placeholder={t.fields.email}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input-sharp font-thai ${errors.email ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                />
                                <input
                                    name="phone"
                                    placeholder={t.fields.phone}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`input-sharp font-thai ${errors.phone ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                />
                                <div className="flex justify-end pt-4">
                                    <button onClick={nextStep} className="btn-sharp flex items-center gap-2 font-thai">
                                        {t.btn_next} <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-semibold text-zinc-300 font-thai">{t.step2_title}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="carMake"
                                        placeholder={t.fields2.make}
                                        value={formData.carMake}
                                        onChange={handleChange}
                                        className={`input-sharp font-thai ${errors.carMake ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                    />
                                    <input
                                        name="carModel"
                                        placeholder={t.fields2.model}
                                        value={formData.carModel}
                                        onChange={handleChange}
                                        className={`input-sharp font-thai ${errors.carModel ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                    />
                                </div>
                                <input
                                    name="carYear"
                                    placeholder={t.fields2.year}
                                    type="number"
                                    value={formData.carYear}
                                    onChange={handleChange}
                                    className={`input-sharp font-thai ${errors.carYear ? 'border-red-500 ring-1 ring-red-500 bg-red-500/10' : ''}`}
                                />
                                <div className="flex justify-between pt-4">
                                    <button onClick={prevStep} className="text-zinc-400 hover:text-white transition font-thai">{t.btn_back}</button>
                                    <button onClick={nextStep} className="btn-sharp flex items-center gap-2 font-thai">
                                        {t.btn_next} <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-semibold text-zinc-300 font-thai">{t.step3_title}</h2>

                                <div
                                    className="border-2 border-dashed border-zinc-700 rounded-sm p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-black/20 relative"
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                            setFiles([...files, ...Array.from(e.dataTransfer.files)]);
                                        }
                                    }}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setFiles([...files, ...Array.from(e.target.files)]);
                                            }
                                        }}
                                    />
                                    <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                                    <p className="text-zinc-400 font-thai">{t.upload}</p>
                                    {files.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {files.map((f, i) => (
                                                <div key={i} className="text-sm text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block mx-1">
                                                    {f.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <textarea name="notes" placeholder={t.notes} value={formData.notes} onChange={handleChange} className="input-sharp min-h-[100px] font-thai" />
                                <div className="flex justify-between pt-4">
                                    <button onClick={prevStep} className="text-zinc-400 hover:text-white transition font-thai">{t.btn_back}</button>
                                    <button onClick={handleSubmit} disabled={isSubmitting} className="btn-sharp w-full ml-4 font-thai">
                                        {isSubmitting ? "Submitting..." : t.btn_submit}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 ring-1 ring-emerald-500/50">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-white font-thai">{t.success_title}</h2>
                                <p className="text-zinc-400 mb-6 max-w-sm mx-auto font-thai">{t.success_msg}</p>
                                <p className="text-zinc-500 text-sm mb-6">Tracking ID: <span className="font-mono text-emerald-400">{submissionId}</span></p>
                                <button onClick={() => navigate('/')} className="text-emerald-500 hover:text-emerald-400 font-bold underline">
                                    Back to Home
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default CustomerForm;
