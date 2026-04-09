"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Edit3,
  Plus,
  Search,
  UtensilsCrossed,
  X,
  Tag,
  ImageIcon,
  Eye
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  discount: number;
  images: string[];
};

export default function AdminMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم حذف هذه الوجبة نهائياً من القائمة!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'نعم، احذفها',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
      Swal.fire({ title: 'تم الحذف بنجاح', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const updateItem = async () => {
    if (!editingItem) return;
    const { id, ...updateData } = editingItem;

    const res = await fetch(`/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      setEditingItem(null);
      fetchItems();
      Swal.fire({ title: 'تم التحديث!', icon: 'success', timer: 1500, showConfirmButton: false });
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              المنيو <span className="text-orange-500 underline underline-offset-8">الذكي</span> <UtensilsCrossed />
            </h1>
            <p className="text-slate-500 mt-2 font-medium">إدارة الأصناف، الأسعار، والعروض الحصرية</p>
          </div>
          <Link href="/admin/menu/Add">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-[2rem] flex items-center gap-3 font-bold shadow-xl shadow-orange-200 transition-all active:scale-95">
              <Plus size={24} /> إضافة صنف جديد
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl">
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input
            placeholder="ابحث عن اسم الوجبة أو المكونات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-5 pr-14 rounded-[1.5rem] border-none shadow-sm focus:ring-4 focus:ring-orange-500/10 outline-none text-slate-700 font-medium"
          />
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  {/* Discount Badge */}
                  {item.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                      خصم {item.discount}%
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-black text-slate-800 leading-tight">{item.name}</h2>
                    <div className="text-right">
                      {item.discount > 0 ? (
                        <>
                          <p className="text-xs text-slate-400 line-through font-bold">{item.price} EGP</p>
                          <p className="text-lg font-black text-emerald-600">{(item.price - (item.price * item.discount / 100)).toFixed(0)} EGP</p>
                        </>
                      ) : (
                        <p className="text-lg font-black text-orange-600">{item.price} EGP</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                    {item.description || "لا يوجد وصف لهذا الصنف حالياً."}
                  </p>

                  {/* Actions Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="flex-1 bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 p-3 rounded-2xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <Edit3 size={18} /> تعديل
                    </button>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-3 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal التعديل المحسن */}
        <AnimatePresence>
          {editingItem && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-white p-8 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-slate-800">تحديث بيانات الصنف</h2>
                  <button onClick={() => setEditingItem(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={20}/></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 mr-2">اسم الصنف</label>
                    <input
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border border-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 mr-2">السعر الأصلي</label>
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border border-slate-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 mr-2">نسبة الخصم (%)</label>
                    <input
                      type="number"
                      value={editingItem.discount}
                      onChange={(e) => setEditingItem({ ...editingItem, discount: Number(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border border-slate-100"
                    />
                  </div>
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 mr-2">التصنيف</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100"
                    >
                      <option value="meals">وجبات</option>
                      <option value="drinks">مشروبات</option>
                      <option value="grills">مشويات</option>
                    </select>
                  </div>
                  <div className="col-span-full space-y-1">
                    <label className="text-xs font-bold text-slate-400 mr-2">وصف الوجبة</label>
                    <textarea
                      rows={3}
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 border border-slate-100"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button onClick={updateItem} className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">حفظ التغييرات</button>
                  <button onClick={() => setEditingItem(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">إلغاء</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}