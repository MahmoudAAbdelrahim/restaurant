"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ShieldCheck, Banknote, ChevronDown, Play, Star, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [topItems, setTopItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب البيانات وحساب الأفضل تقييماً
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const [menuRes, reviewsRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/reviews")
        ]);
        const menu = await menuRes.json();
        const reviews = await reviewsRes.json();

        // حساب متوسط التقييم لكل وجبة
        const menuWithRatings = menu.map((item: any) => {
          const itemReviews = reviews.filter((r: any) => r.itemId === item.id);
          const avg = itemReviews.length > 0 
            ? itemReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / itemReviews.length 
            : 0;
          return { ...item, avgRating: avg, reviewCount: itemReviews.length };
        });

        // ترتيب حسب التقييم ثم عدد المراجعات واختيار أول 10
        const sorted = menuWithRatings
          .sort((a: any, b: any) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount)
          .slice(0, 10);

        setTopItems(sorted);
      } catch (err) {
        console.error("Failed to load top items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden" dir="rtl">
      
      {/* Hero Section (نفس الكود بتاعك) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 z-0">
           <motion.img
             initial={{ scale: 1.2 }}
             animate={{ scale: 1 }}
             transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
             src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
             className="w-full h-full object-cover"
             alt="Hero Steak"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white"></div>
         </div>

         <div className="relative z-10 text-center px-6">
           <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
             <span className="inline-block py-1 px-4 rounded-full bg-orange-600 text-white text-sm font-bold mb-4 animate-bounce">
               خصم 20% على أول طلب 🎁
             </span>
           </motion.div>

           <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">
             أطعم وأحلى <br /> <span className="text-orange-500">أكل في المحروسة 🔥</span>
           </h1>

           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Link href="/menu">
               <motion.button whileHover={{ scale: 1.1 }} className="bg-orange-600 text-white px-10 py-4 rounded-full text-xl font-black flex items-center gap-2">
                 اطلب الآن <Rocket size={24} />
               </motion.button>
             </Link>
           </div>
         </div>
      </section>

      {/* قسم المميزات */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard icon={<Rocket className="text-orange-600" size={40} />} title="سرعة التوصيل" desc="أكلك هيوصلك في أقل من 30 دقيقة." />
          <FeatureCard icon={<ShieldCheck className="text-orange-600" size={40} />} title="أعلى جودة" desc="لحوم بلدي وخضار طازج يومياً." />
          <FeatureCard icon={<Banknote className="text-orange-600" size={40} />} title="أفضل سعر" desc="وجبات تشبعك بأقل تكلفة." />
        </div>
      </section>

      {/* قسم التوب 10 (الجديد) */}
      <section className="py-24 bg-gray-50 rounded-[4rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-orange-600 font-bold tracking-widest flex items-center gap-2 mb-2">
                <Flame size={20} fill="#ea580c"/> الأكثر طلباً
              </span>
            </div>
            <Link href="/menu" className="text-orange-600 font-bold flex items-center gap-2 hover:underline">
              عرض المنيو كامل <ArrowRight size={20}/>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  text-gray-900">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  text-gray-900">
              {topItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id}
                  className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-200/50 group hover:scale-[1.02] transition-all"
                >
                  <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                    <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl flex items-center gap-1 font-bold shadow-sm">
                      <Star size={16} fill="#f97316" className="text-orange-500" />
                      {item.avgRating > 0 ? item.avgRating.toFixed(1) : "جديد"}
                    </div>
                    {index < 3 && (
                      <div className="absolute top-4 right-4 bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                        #{index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 pb-4">
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-black text-xl">{item.price} EGP</span>
                      <Link href={`/menu/${item.id}`}>
                        <button className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-orange-600 transition-colors">
                          <ArrowRight size={20}/>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

// الـ FeatureCard والـ Props (نفس اللي عندك)
function FeatureCard({ icon, title, desc }: any) {
  return (
    <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center">
      <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">{icon}</div>
      <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-500 font-medium">{desc}</p>
    </motion.div>
  );
}