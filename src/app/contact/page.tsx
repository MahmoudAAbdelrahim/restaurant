"use client";

import React from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-white min-h-screen py-24 px-6">
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

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">الاسم بالكامل</label>
                <input
                  type="text"
                  placeholder="محمد أحمد"
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">رقم الموبايل</label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700 mr-2">رسالتك</label>
              <textarea
                rows={4}
                placeholder="إزاي نقدر نساعدك؟"
                className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 p-4 rounded-2xl transition-all outline-none text-gray-800 resize-none"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-700 transition-colors"
            >
              إرسال الرسالة
              <Send size={20} />
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group"
        >
          <div className="absolute inset-0 bg-orange-600/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123456789!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            className="grayscale hover:grayscale-0 transition-all duration-700"
          ></iframe>
        </motion.div>

      </div>
    </div>
  );
}

type ContactInfoCardProps = {
  icon: React.ReactNode;
  title: string;
  detail: string;
  sub: string;
};

function ContactInfoCard({ icon, title, detail, sub }: ContactInfoCardProps) {
  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="flex items-center gap-5 p-6 bg-orange-50/50 rounded-3xl border border-orange-100/50"
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