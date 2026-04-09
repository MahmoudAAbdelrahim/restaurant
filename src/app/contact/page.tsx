"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Contact() {
  // 1. States للبيانات وحالة الإرسال
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // 2. وظيفة الإرسال الحقيقية
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
      // استبدل هذا المسار بمسار الـ API الخاص بك
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSent(true);
        setFormData({ name: "", phone: "", message: "" });
        
        // رسالة نجاح بشكل شيك جداً
        Swal.fire({
          title: "وصلت يا فنان! 🚀",
          text: "شكراً لرسالتك، فريقنا هيتواصل معاك في أسرع وقت.",
          icon: "success",
          confirmButtonColor: "#ea580c",
          timer: 4000
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      Swal.fire("عذراً", "حصل مشكلة بسيطة، جرب تبعت تاني", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-24 px-6" >
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">نحن هنا من أجلك</span>
          <h1 className="text-5xl font-black text-gray-900 mt-2">يسعدنا <span className="text-orange-500">سماع</span> صوتك</h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-medium">
            سواء كان لديك استفسار، اقتراح، أو حتى تريد أن تبدي إعجابك بطعامنا، فريقنا دائماً جاهز للرد عليك.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <ContactInfoCard 
              icon={<Phone className="text-orange-600" />} 
              title="رقم الهاتف" 
              detail="+20 123 456 7890" 
              sub="متاح 24 ساعة للطلبات"
            />
            <ContactInfoCard 
              icon={<Mail className="text-orange-600" />} 
              title="البريد الإلكتروني" 
              detail="hello@foodhub.com" 
              sub="رد خلال 24 ساعة عمل"
            />
            <ContactInfoCard 
              icon={<Clock className="text-orange-600" />} 
              title="ساعات العمل" 
              detail="01:00 PM - 02:00 AM" 
              sub="طوال أيام الأسبوع"
            />
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden"
          >
            <AnimatePresence>
              {isSent ? (
                // رسالة الشكر اللي بتظهر مكان الفورم بعد الإرسال
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-10 z-10"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", damping: 10 }}
                    className="bg-green-100 p-6 rounded-full text-green-600 mb-6"
                  >
                    <CheckCircle2 size={60} />
                  </motion.div>
                  <h2 className="text-3xl font-black text-gray-900">شكراً لمراسلتك لنا!</h2>
                  <p className="text-gray-500 mt-3 text-lg">رسالتك بقت في أيد أمينة، هنرد عليك في أقرب وقت ممكن.</p>
                  <button 
                    onClick={() => setIsSent(false)}
                    className="mt-8 text-orange-600 font-bold underline"
                  >
                    إرسال رسالة أخرى
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-right">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2">الاسم بالكامل</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="محمد أحمد"
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2">رقم الموبايل</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-8 text-right">
                <label className="text-sm font-bold text-gray-700 mr-2">رسالتك</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="إزاي نقدر نساعدك؟"
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800 resize-none"
                />
              </div>

              <motion.button 
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-orange-600'} text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-700 transition-colors`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <> إرسال الرسالة <Send size={20} className="rotate-180" /> </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group"
        >
          <div className="absolute inset-0 bg-orange-600/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55235.1554593451!2d31.2332158!3d30.0442371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb2963360afb!2sCairo%2C%20Cairo%20 Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen={true}
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  className="grayscale hover:grayscale-0 transition-all duration-700"
></iframe>
        </motion.div>

      </div>
    </div>
  );
}

// الكارد الفرعي
function ContactInfoCard({ icon, title, detail, sub }: { icon: React.ReactNode; title: string; detail: string; sub: string; }) {
  return (
    <motion.div 
      whileHover={{ x: -10 }} // تم التعديل ليتناسب مع اتجاه اليمين
      className="flex items-center gap-5 p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50 text-right"
    >
      <div className="bg-white p-4 rounded-2xl shadow-sm text-orange-600">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        <p className="text-xl font-black text-gray-900 leading-none mt-1">{detail}</p>
        <p className="text-xs text-orange-600 mt-1 font-medium">{sub}</p>
      </div>
    </motion.div>
  );
}
