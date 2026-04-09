"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, UtensilsCrossed, Menu, X, Home, BookOpen, Info, Phone } from "lucide-react";
// استيراد الـ Hook الخاص بالسلة
import { useCart } from "../store/cart"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // الوصول لمنتجات السلة
  const { items } = useCart();
  
  // حساب عدد المنتجات الإجمالي (كميات كل صنف)
  // استخدمنا useEffect مع State بسيطة لتجنب مشاكل الـ Hydration في Next.js
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(total);
  }, [items]);

  const navLinks = [
    { name: "الرئيسية", href: "/", icon: <Home size={18} /> },
    { name: "المنيو", href: "/menu", icon: <BookOpen size={18} /> },
    { name: "عن المطعم", href: "/about", icon: <Info size={18} /> },
    { name: "تواصل معنا", href: "/contact", icon: <Phone size={18} /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="bg-orange-600 p-2 rounded-lg text-white"
          >
            <UtensilsCrossed size={24} />
          </motion.div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-orange-600 transition-colors">
            FOOD<span className="text-orange-600 text-3xl">.</span>HUB
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="relative text-gray-600 font-bold hover:text-orange-600 transition-colors group flex items-center gap-1"
            >
              {link.name}
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"
                layoutId="underline"
              />
            </Link>
          ))}
        </div>

        {/* CTA Section - زرار السلة بالرقم الحقيقي */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-200 flex items-center gap-2 group"
            >
              <motion.div
                // أنميشن بسيط يهتز لما العدد يتغير
                key={cartCount}
                animate={{ scale: [1, 1.2, 1] }}
              >
                <ShoppingCart size={20} />
              </motion.div>
              <span className="hidden sm:inline">السلة</span>
              
              {/* Badge - الرقم الحقيقي */}
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[11px] min-w-[20px] h-5 flex items-center justify-center rounded-full font-black border-2 border-white px-1"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-gray-700 hover:text-orange-600"
                >
                  <span className="bg-gray-50 p-2 rounded-lg">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}