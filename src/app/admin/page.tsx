"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  Clock, CheckCircle, AlertCircle, ArrowUpRight 
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import Link from "next/link"; // تأكد من استيراد Link

export default function AdminHome() {
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/reviews")
        ]);
        const ordersData = await ordersRes.json();
        const reviewsData = await reviewsRes.json();
        
        setOrders(ordersData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = orders
    .filter(o => o.status !== "canceled")
    .reduce((acc, o) => acc + (o.total || 0), 0);

  const today = new Date().toLocaleDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toLocaleDateString() === today);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const getChartData = () => {
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const daySales = orders
        .filter(o => new Date(o.createdAt).toLocaleDateString() === d.toLocaleDateString() && o.status !== "canceled")
        .reduce((acc, o) => acc + (o.total || 0), 0);
      return { name: days[d.getDay()], sales: daySales };
    }).reverse();
  };

  if (loading) return <div className="p-20 text-center font-bold">جاري تحميل البيانات الحقيقية...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      <main className="p-8 max-w-[1600px] mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900">لوحة التحكم <span className="text-indigo-600">الذكية</span> 🔥</h1>
            <p className="text-slate-500 mt-1">إليك ملخص أداء المطعم الفعلي من قاعدة البيانات.</p>
          </div>
        </div>

        {/* Stats Cards - تم حل المشكلة هنا */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="إجمالي المبيعات" value={`${totalSales.toLocaleString()}`} icon={<DollarSign />} trend="EGP" color="bg-indigo-600" />
          <StatCard title="طلبات اليوم" value={`${todayOrders.length}`} icon={<ShoppingBag />} trend="+جديد" color="bg-orange-500" />
          <StatCard title="التقييمات" value={`${reviews.length}`} icon={<Users />} trend="رأي" color="bg-violet-600" />
          <StatCard title="المتوسط" value={`${avgRating}`} icon={<TrendingUp />} trend="/ 5" color="bg-emerald-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black mb-8 text-slate-800">تحليل المبيعات</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#4F46E5" fillOpacity={0.1} fill="#4F46E5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black mb-6 text-slate-800">آخر الطلبات</h3>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <OrderMini 
                  key={order.id}
                  title={order.orderType === "delivery" ? order.customerInfo?.name : `تربيزة ${order.tableNumber}`}
                  time={new Date(order.createdAt).toLocaleTimeString('ar-EG')}
                  status={order.status}
                  price={order.total}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- التعريفات المفقودة (Components) ---

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-bold mb-1">{title}</p>
        <h4 className="text-3xl font-black text-slate-900">{value}</h4>
        <span className="text-xs font-bold text-emerald-500">{trend}</span>
      </div>
      <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
        {icon}
      </div>
    </motion.div>
  );
}

function OrderMini({ title, time, status, price }: any) {
  const statusIcons: any = {
    pending: <Clock className="text-orange-500" size={16} />,
    preparing: <Clock className="text-blue-500" size={16} />,
    done: <CheckCircle className="text-emerald-500" size={16} />,
    canceled: <AlertCircle className="text-red-500" size={16} />
  };

  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
          {statusIcons[status] || <Clock size={16}/>}
        </div>
        <div>
          <h5 className="text-sm font-bold text-slate-800">{title || "عميل مجهول"}</h5>
          <p className="text-xs text-slate-400">{time}</p>
        </div>
      </div>
      <p className="text-sm font-black text-slate-700">{price} EGP</p>
    </div>
  );
}