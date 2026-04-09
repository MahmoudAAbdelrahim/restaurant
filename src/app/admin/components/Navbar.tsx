"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  ClipboardList, 
  UtensilsCrossed, 
  PlusCircle, 
  Settings,
  LogOut
} from "lucide-react";

export default function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { name: "الرئيسية", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "الطلبات", href: "/admin/orders", icon: <ClipboardList size={20} /> },
    { name: "المنيو", href: "/admin/menu", icon: <UtensilsCrossed size={20} /> },
    { name: "إضافة صنف", href: "/admin/menu/Add", icon: <PlusCircle size={20} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-sm">
      
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
          <Settings size={22} className="animate-spin-slow" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-slate-900 leading-none">Admin Panel</span>
          <span className="text-[10px] text-indigo-600 font-bold tracking-[0.2em] uppercase">Control Center</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="relative">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                  ? "text-white" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-white"
                }`}
              >
                {/* Background for Active Link */}
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
        <div className="hidden sm:flex flex-col text-right">
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

      {/* Mobile Indicator (Only for small screens) */}
      <div className="md:hidden">
        <span className="text-indigo-600 font-black">•••</span>
      </div>
    </nav>
  );
}