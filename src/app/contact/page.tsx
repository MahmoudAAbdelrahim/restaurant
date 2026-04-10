"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Phone, Mail, Clock, CheckCircle2, 
  Loader2, Star 
} from "lucide-react";
import Swal from "sweetalert2";

export default function Contact() {
  // 1. States للبيانات وحالة الإرسال (للرسائل)
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // 2. States لتقييم الموقع
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // وظيفة إرسال رسالة تواصل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      return Swal.fire({
        title: "بيانات ناقصة",
        text: "يا بطل كمل بياناتك عشان نعرف نكلمك! 😊",
        icon: "warning",
        confirmButtonColor: "#ea580c"
      });
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSent(true);
        setFormData({ name: "", phone: "", message: "" });
        Swal.fire({
          title: "وصلت يا فنان! 🚀",
          text: "شكراً لرسالتك، فريقنا هيتواصل معاك في أسرع وقت.",
          icon: "success",
          confirmButtonColor: "#ea580c",
          timer: 4000
        });
      }
    } catch (error) {
      Swal.fire("عذراً", "حصل مشكلة بسيطة، جرب تبعت تاني", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // وظيفة إرسال تقييم الموقع
  const submitWebsiteReview = async () => {
    if (rating === 0) return Swal.fire("رأيك يهمنا", "من فضلك اختار عدد النجوم الأول 😊", "info");
    
    setIsReviewLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: "website", // العلامة المميزة لتقييم الموقع
          userName: "عميل الموقع",
          rating: rating,
          comment: "تقييم عام لجودة الموقع والخدمة"
        })
      });

      if (res.ok) {
        Swal.fire({
          title: "شكراً لذوقك! ❤️",
          text: "تقييمك وصل وهنستخدمه عشان نطور من نفسنا.",
          icon: "success",
          confirmButtonColor: "#ea580c"
        });
        setRating(0);
      }
    } catch (error) {
      Swal.fire("عذراً", "حصل مشكلة، حاول مرة تانية", "error");
    } finally {
      setIsReviewLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-24 px-6" >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">نحن هنا من أجلك</span>
          <h1 className="text-5xl font-black text-gray-900 mt-2">يسعدنا <span className="text-orange-500">سماع</span> صوتك</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <motion.div variants={containerVariants} initial="hidden" text-gray-900 animate="visible" className="space-y-6">
            <ContactInfoCard icon={<Phone className="text-orange-600" />} title="رقم الهاتف" detail="+20 123 456 7890" sub="متاح 24 ساعة للطلبات" />
            <ContactInfoCard icon={<Mail className="text-orange-600" />} title="البريد الإلكتروني" detail="hello@foodhub.com" sub="رد خلال 24 ساعة عمل" />
            <ContactInfoCard icon={<Clock className="text-orange-600" />} title="ساعات العمل" detail="01:00 PM - 02:00 AM" sub="طوال أيام الأسبوع" />
          </motion.div>

          {/* Form Section */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
            <AnimatePresence>
              {isSent && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-10 z-10">
                  <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6"><CheckCircle2 size={60} /></div>
                  <h2 className="text-3xl font-black text-gray-900">شكراً لمراسلتك لنا!</h2>
                  <button onClick={() => setIsSent(false)} className="mt-8 text-orange-600 font-bold underline">إرسال رسالة أخرى</button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-right text-gray-900">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2 border-r-4 border-orange-500 pr-2">الاسم بالكامل</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="محمد أحمد" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2 border-r-4 border-orange-500 pr-2">رقم الموبايل</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="01xxxxxxxxx" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
              </div>
              <div className="space-y-2 mb-8 text-right text-gray-900">
                <label className="text-sm font-bold text-gray-700 mr-2 border-r-4 border-orange-500 pr-2">رسالتك</label>
                <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="إزاي نقدر نساعدك؟" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none" />
              </div>
              <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-orange-600'} text-white py-5 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3`}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <> إرسال الرسالة <Send size={20} className="rotate-180" /> </>}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* --- قسم تقييم الموقع (Website Review Section) --- */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="mt-16 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-10 text-center text-white shadow-xl shadow-indigo-100" dir="rtl">
          <h2 className="text-3xl font-black mb-2">إيه رأيك في موقعنا؟</h2>
          <p className="text-indigo-200 mb-8 font-medium">تقييمك السريع بيساعدنا نحسن خدمتنا ليك</p>
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="transition-transform hover:scale-125">
                <Star size={45} fill={(hover || rating) >= star ? "#fbbf24" : "none"} stroke={(hover || rating) >= star ? "#fbbf24" : "currentColor"} />
              </button>
            ))}
          </div>
          <button onClick={submitWebsiteReview} disabled={isReviewLoading} className="bg-white text-indigo-900 px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all disabled:opacity-50">
            {isReviewLoading ? "جاري الإرسال..." : "إرسال التقييم"}
          </button>
        </motion.div>

        {/* Map Section */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.12345678!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg" width="100%" height="450" style={{ border: 0 }} loading="lazy" className="grayscale hover:grayscale-0 transition-all duration-700"></iframe>
        </motion.div>

      </div>
    </div>
  );
}

function ContactInfoCard({ icon, title, detail, sub }: { icon: React.ReactNode; title: string; detail: string; sub: string; }) {
  return (
    <motion.div whileHover={{ x: -10 }} className="flex items-center gap-5 p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50 text-right">
      <div className="bg-white p-4 rounded-2xl shadow-sm text-orange-600">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="text-xl font-black text-gray-900 mt-1">{detail}</p>
        <p className="text-xs text-orange-600 mt-1 font-medium">{sub}</p>
      </div>
    </motion.div>
  );
}