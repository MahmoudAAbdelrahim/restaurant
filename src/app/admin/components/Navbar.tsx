"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  PlusCircle, 
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Star
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // حالة فتح وقفل المنيو للموبايل

  const links = [
    { name: "الرئيسية", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "الطلبات", href: "/admin/orders", icon: <ClipboardList size={20} /> },
    { name: "المنيو", href: "/admin/menu", icon: <UtensilsCrossed size={20} /> },
    { name: "إضافة صنف", href: "/admin/menu/Add", icon: <PlusCircle size={20} /> },
    { name: "الرسائل", href: "/admin/messages", icon: <MessageSquare size={20} /> },
    { name: "تقييم الأكل", href: "/admin/reviews", icon: <Star size={20} /> },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm" >
        
        {/* زرار الموبايل (يظهر فقط في الشاشات الصغيرة) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 bg-slate-50 rounded-xl text-indigo-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
            <Settings size={22} />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-lg font-black text-slate-900 leading-none">Admin Panel</span>
            <span className="text-[10px] text-indigo-600 font-bold tracking-[0.1em] uppercase">Control Center</span>
          </div>
        </div>

        {/* Navigation Links (الشاشات الكبيرة فقط) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive ? "text-white" : "text-slate-500 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.icon}</span>
                  <span className="relative z-10">{link.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-900">أحمد المدير</span>
            <span className="text-[10px] text-slate-400 font-medium italic">Super Admin</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </nav>

      {/* --- Mobile Menu Drawer --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop (خلفية شفافة تقفل المنيو عند الضغط عليها) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] md:hidden"
            />
            
            {/* Menu Content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[280px] bg-white z-[80] shadow-2xl p-6 md:hidden"
              dir="rtl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-black text-xl text-indigo-600">القائمة</span>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setIsOpen(false)} // اقفل المنيو بعد الضغط
                    >
                      <div className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                        isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                      }`}>
                        {link.icon}
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}