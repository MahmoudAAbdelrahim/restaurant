"use client"; 

import React from "react";
import { motion } from "framer-motion";
import { Utensils, Truck, Star, Award } from "lucide-react";
import CountUp from "react-countup";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white min-h-screen py-20 px-6 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">حكايتنا</span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mt-2 mb-6">
            أصل الطعم <span className="text-orange-500">الحقيقي</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            بدأنا بشغف لتقديم تجربة طعام لا تُنسى. نختار مكوناتنا بعناية فائقة لنقدم لك وجبة تليق بوقفك، لأنك تستحق الأفضل دائماً.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full z-0 animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
              alt="Restaurant Experience"
              className="relative z-10 rounded-3xl shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500 rounded-2xl -z-10 rotate-12"></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Utensils size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">جودة لا تضاها</h3>
                <p className="text-gray-500">نستخدم أجود اللحوم والخضروات الطازجة يومياً من المزرعة لمطبخنا مباشرة.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Truck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">توصيل صاروخي</h3>
                <p className="text-gray-500">أكلنا بيوصلك سخن وكأنه لسه طالع من النار، في أسرع وقت ممكن.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
          <StatBox icon={<Star className="text-yellow-500" />} number={150} suffix="K+" label="زبون سعيد" />
          <StatBox icon={<Utensils className="text-orange-500" />} number={85} suffix="+" label="صنف مميز" />
          <StatBox icon={<Award className="text-blue-500" />} number={12} suffix="" label="جائزة جودة" />
          <StatBox icon={<Truck className="text-green-500" />} number={20} suffix="min" label="متوسط التوصيل" />
        </div>

      </div>
    </div>
  );
}

type StatBoxProps = {
  icon: React.ReactNode;
  number: number;
  suffix: string;
  label: string;
};

function StatBox({ icon, number, suffix, label }: StatBoxProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="text-center p-4"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <h2 className="text-4xl font-black text-gray-900 mb-1">
        <CountUp end={number} duration={3} enableScrollSpy />
        {suffix}
      </h2>
      <p className="text-gray-400 font-medium">{label}</p>
    </motion.div>
  );
}