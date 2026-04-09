"use client";

import { motion } from "framer-motion";
// استيراد الأيقونات من Font Awesome (fa) و Feather (fi)
import { FaFacebookF, FaInstagram, FaXTwitter} from "react-icons/fa6";
import { FiMapPin, FiClock, FiHeart } from "react-icons/fi";
import { LuChefHat } from "react-icons/lu";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { Icon: FaFacebookF, href: "#", color: "hover:bg-[#1877F2]" },
    { Icon: FaInstagram, href: "#", color: "hover:bg-[#E4405F]" },
    { Icon: FaXTwitter, href: "#", color: "hover:bg-black" }
  ];

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-16 pb-8 px-6 border-t border-white/5" >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6 text-right">
            <Link href="/" className="flex items-center justify-start gap-2 group">
              <div className="bg-orange-600 p-2 rounded-xl text-white">
                <LuChefHat size={24} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                DELICIOUS<span className="text-orange-600">.</span>
              </span>
            </Link>
            <p className="leading-relaxed text-sm">
              نقدم لك تجربة طعام فريدة تجمع بين الجودة العالية والمذاق الأصيل من قلب أسيوط.
            </p>
            <div className="flex justify-start gap-3">
              {socialIcons.map(({ Icon, href, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ y: -5 }}
                  className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300 text-white ${color}`}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-right">
            <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-4">
              {["الرئيسية", "المنيو", "عن المطعم", "تواصل معنا"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-orange-500 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="text-right">
            <h3 className="text-white font-bold text-lg mb-6 text-orange-600">ساعات العمل</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-white font-medium">السبت - الأربعاء</p>
                  <p className="text-gray-500">10:00 ص - 12:00 م</p>
                </div>
                <FiClock className="text-orange-500" size={20} />
              </div>
              <div className="flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-white font-medium">الخميس - الجمعة</p>
                  <p className="text-gray-500">10:00 ص - 02:00 ص</p>
                </div>
                <FiClock className="text-orange-500" size={20} />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-right">
            <h3 className="text-white font-bold text-lg mb-6">تواصل معنا</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-end gap-3">
                <span>أسيوط، شارع الجمهورية</span>
                <FiMapPin className="text-orange-500" size={18} />
              </div>
              <div className="flex items-center justify-end gap-3">
                <span dir="ltr">+20 123 456 789</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-xs tracking-wide">
          <p>© {currentYear} جميع الحقوق محفوظة لـ <span className="text-white font-bold uppercase">Mahmoud Ali</span></p>
          <div className="flex items-center gap-2">
            MADE WITH <FiHeart className="text-red-600 fill-red-600 animate-pulse" /> BY CODIX
          </div>
        </div>
      </div>
    </footer>
  );
}