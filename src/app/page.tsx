"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ShieldCheck, Banknote, Star, ArrowRight, Flame, Quote, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [topItems, setTopItems] = useState<any[]>([]);
  const [websiteReviews, setWebsiteReviews] = useState<any[]>([]); // حالة تقييمات الموقع
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, reviewsRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/reviews")
        ]);
        const menu = await menuRes.json();
        const allReviews = await reviewsRes.json();

        // 1. حساب الـ Top 10 للوجبات
        const menuWithRatings = menu.map((item: any) => {
          const itemReviews = allReviews.filter((r: any) => r.itemId === item._id); // تأكد من استخدام _id
          const avg = itemReviews.length > 0 
            ? itemReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / itemReviews.length 
            : 0;
          return { ...item, avgRating: avg, reviewCount: itemReviews.length };
        });

        const sorted = menuWithRatings
          .sort((a: any, b: any) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
          .slice(0, 10);
        setTopItems(sorted);

        // 2. فلترة تقييمات الموقع فقط للعرض في القسم الجديد
        const siteReviews = allReviews.filter((r: any) => r.itemId === "website");
        setWebsiteReviews(siteReviews);

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
         {/* ... (نفس كود الهيرو بتاعك بدون تغيير) ... */}
         <div className="absolute inset-0 z-0">
           <motion.img
             initial={{ scale: 1.2 }} animate={{ scale: 1 }}
             transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
             src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
             className="w-full h-full object-cover" alt="Hero Steak"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white"></div>
         </div>
         <div className="relative z-10 text-center px-6">
           <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
             <span className="inline-block py-1 px-4 rounded-full bg-orange-600 text-white text-sm font-bold mb-4 animate-bounce">خصم 20% على أول طلب 🎁</span>
           </motion.div>
           <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">أطعم وأحلى <br /> <span className="text-orange-500">أكل في المحروسة 🔥</span></h1>
           <Link href="/menu">
             <motion.button whileHover={{ scale: 1.1 }} className="bg-orange-600 text-white px-10 py-4 rounded-full text-xl font-black flex items-center gap-2 mx-auto">اطلب الآن <Rocket size={24} /></motion.button>
           </Link>
         </div>
      </section>

      {/* 2. قسم المميزات */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard icon={<Rocket className="text-orange-600" size={40} />} title="سرعة التوصيل" desc="أكلك هيوصلك في أقل من 30 دقيقة." />
          <FeatureCard icon={<ShieldCheck className="text-orange-600" size={40} />} title="أعلى جودة" desc="لحوم بلدي وخضار طازج يومياً." />
          <FeatureCard icon={<Banknote className="text-orange-600" size={40} />} title="أفضل سعر" desc="وجبات تشبعك بأقل تكلفة." />
        </div>
      </section>

      {/* 3. قسم التوب 10 */}
      <section className="py-24 bg-gray-50 rounded-[4rem]">
        {/* ... (نفس كود التوب 10 بتاعك بدون تغيير) ... */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12 text-gray-900">
            <span className="text-orange-600 font-bold flex items-center gap-2"><Flame size={20} fill="#ea580c"/> الأكثر طلباً</span>
            <Link href="/menu" className="text-orange-600 font-bold flex items-center gap-2">عرض المنيو كامل <ArrowRight size={20}/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-900">
            {topItems.map((item, index) => (
              <motion.div key={item._id} className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-200/50 group">
                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                  <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={item.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl flex items-center gap-1 font-bold shadow-sm">
                    <Star size={16} fill="#f97316" className="text-orange-500" /> {item.avgRating > 0 ? item.avgRating.toFixed(1) : "جديد"}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-2xl font-black mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center text-gray-900 font-black text-xl">{item.price} EGP <ArrowRight size={20}/></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. قسم تقييمات الموقع (الجديد كلياً) */}
      {websiteReviews.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-black tracking-widest uppercase text-sm">ماذا يقول عملائنا</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">آراء خلتنا <span className="text-indigo-600">نكبر ❤️</span></h2>
            </div>

            <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 custom-scrollbar scroll-smooth">
              {websiteReviews.map((rev, index) => (
                <motion.div
                  key={rev._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="min-w-[300px] md:min-w-[400px] bg-slate-50 p-8 rounded-[3rem] relative overflow-hidden"
                >
                  <Quote className="absolute top-6 left-6 text-indigo-100" size={60} />
                  <div className="relative z-10 text-gray-900">
                    <div className="flex text-yellow-500 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <p className="text-lg font-medium italic mb-8 leading-relaxed text-gray-700">"{rev.comment}"</p>
                    <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
                      <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-black uppercase">
                        {rev.userName?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{rev.userName}</span>
                        <span className="text-xs text-gray-400">عميل مخلص للموقع</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

// الكومبوننت الفرعي للمميزات
function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center text-gray-900">
      <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">{icon}</div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-gray-500 font-medium">{desc}</p>
    </motion.div>
  );
}