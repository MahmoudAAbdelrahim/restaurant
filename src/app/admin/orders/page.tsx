"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle2, Flame, Loader2, 
  MapPin, Utensils, Receipt, Check, Phone, User, Home, LayoutGrid
} from "lucide-react";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  status: "pending" | "preparing" | "done";
  orderType: "delivery" | "in-restaurant";
  tableNumber?: number;
  customerInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"delivery" | "in-restaurant">("in-restaurant");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: Order["status"]) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // تصفية الطلبات بناءً على التبويب المختار
  const filteredOrders = orders.filter(order => order.orderType === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              إدارة الطلبات <Flame className="text-orange-500 animate-pulse" />
            </h1>
            <p className="text-slate-500 font-medium mt-1">نظام المتابعة اللحظي للمطبخ والتوصيل</p>
          </div>
          
          {/* Tabs Switcher */}
          <div className="bg-white p-1.5 rounded-[2rem] shadow-sm border border-slate-200 flex w-full md:w-auto">
            <button 
              onClick={() => setActiveTab("in-restaurant")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "in-restaurant" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Utensils size={18} /> طلبات الصالة
            </button>
            <button 
              onClick={() => setActiveTab("delivery")}
              className={`flex-1 md:flex-none px-8 py-3 rounded-[1.5rem] font-bold transition-all flex items-center justify-center gap-2 ${activeTab === "delivery" ? "bg-orange-600 text-white shadow-lg shadow-orange-100" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Home size={18} /> التوصيل المنزلي
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border-2 ${
                  order.status === "done" ? "border-emerald-100 opacity-60" : "border-transparent"
                }`}
              >
                {/* Status Bar */}
                <div className={`p-4 flex justify-between items-center ${
                  order.orderType === "delivery" ? "bg-orange-50" : "bg-indigo-50"
                }`}>
                   <span className={`px-4 py-1 rounded-full text-xs font-black ${
                    order.status === "pending" ? "bg-white text-orange-600" : 
                    order.status === "preparing" ? "bg-indigo-600 text-white" : "bg-emerald-500 text-white"
                  }`}>
                    {order.status === "pending" ? "قيد الانتظار" : order.status === "preparing" ? "جاري التحضير" : "مكتمل"}
                  </span>
                  <span className="font-mono font-bold text-slate-400 text-xs">#{order.id.slice(-6)}</span>
                </div>

                <div className="p-6">
                  {/* Customer / Table Info */}
                  <div className="mb-6">
                    {order.orderType === "in-restaurant" ? (
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
                          <Utensils size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">طاولة رقم {order.tableNumber}</h2>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                            <Home size={24} />
                          </div>
                          <h2 className="text-xl font-black text-slate-800">طلب توصيل منزلي</h2>
                        </div>
                        {/* بيانات العميل الحقيقية */}
                        <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100 space-y-2">
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <User size={16} className="text-orange-500" /> {order.customerInfo?.name}
                          </div>
                          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                            <Phone size={16} className="text-orange-500" /> {order.customerInfo?.phone}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin size={16} className="text-orange-500" /> {order.customerInfo?.address}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold text-slate-400 mb-2">الأصناف المطلوبة:</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm border text-indigo-600 font-black">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6 border-t border-dashed pt-4">
                    <span className="text-slate-400 font-bold">الإجمالي</span>
                    <span className="text-2xl font-black text-slate-900">{order.total} <small className="text-sm">EGP</small></span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button 
                        onClick={() => updateStatus(order.id, "preparing")}
                        className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                      >
                        بدء التحضير
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button 
                        onClick={() => updateStatus(order.id, "done")}
                        className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                      >
                        تم التجهيز <CheckCircle2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-white inline-block p-10 rounded-[3rem] shadow-sm border border-slate-100">
                  <LayoutGrid size={60} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold">لا توجد طلبات {activeTab === "delivery" ? "توصيل" : "صالة"} حالياً</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}