"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2, 
  Utensils, 
  Tag, 
  FileText,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";
import Swal from "sweetalert2"; // أنصحك تستخدمه لشكل احترافي بدل الـ alert العادي

export default function AdminPage() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("meals");
  const [description, setDescription] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const uploadImages = async (files: FileList | null) => {
    if (!files) return;
    setIsUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
      );

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) throw new Error("Upload failed");

        const data: { secure_url: string } = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      } catch (err) {
        console.error("Upload error", err);
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setIsUploading(false);
  };

  const addItem = async () => {
    if (!name || !price) {
      return Swal.fire({
        title: 'بيانات ناقصة!',
        text: 'يا بطل ضيف الاسم والسعر على الأقل! 😅',
        icon: 'warning',
        confirmButtonText: 'تمام',
        confirmButtonColor: '#4f46e5'
      });
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          description,
          discount: discount ? Number(discount) : 0,
          images,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#f97316', '#10b981']
      });

      Swal.fire({
        title: 'عاش يا وحش! 🔥',
        text: 'تمت إضافة الوجبة للمنيو بنجاح',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // ريست لكل الفورم
      setName("");
      setPrice("");
      setImages([]);
      setDescription("");
      setDiscount("");
      setCategory("meals");
    } catch (err) {
      console.error(err);
      Swal.fire('خطأ', 'حصلت مشكلة وأنا بضيف الصنف، جرب تاني', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4" >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <motion.h1 
              initial={{ x: 20 }} 
              animate={{ x: 0 }}
              className="text-4xl font-black mb-2 flex items-center gap-3"
            >
              <Utensils size={32} /> إضافة صنف جديد
            </motion.h1>
            <p className="text-indigo-100 opacity-90 text-lg">أبهر زباينك بوجبة جديدة في قائمة الطعام ✨</p>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full -mr-16 -mb-16 blur-2xl"></div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                <Tag size={16} className="text-indigo-500" /> اسم الأكلة
              </label>
              <input
                value={name}
                placeholder="برجر القنبلة"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-4 rounded-2xl transition-all outline-none font-bold text-slate-700"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
                <span className="text-indigo-500 font-black">EGP</span> سعر البيع
              </label>
              <input
                type="number"
                value={price}
                placeholder="150"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-4 rounded-2xl transition-all outline-none font-bold text-slate-700"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" /> وصف الوجبة (عشان الجوع يزيد)
            </label>
            <textarea
              value={description}
              rows={3}
              placeholder="وصف يخلي اللعاب يسيل... مكوناتك السرية هنا"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white p-4 rounded-2xl transition-all outline-none font-medium resize-none text-slate-600"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 mr-2">التصنيف</label>
              <div className="relative">
                <select
                  value={category}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 p-4 rounded-2xl transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="meals">وجبات رئيسية</option>
                  <option value="drinks">مشروبات منعشة</option>
                  <option value="grills">مشويات عالـفحم</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Plus size={18} className="rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 mr-2">نسبة الخصم (%)</label>
              <input
                type="number"
                value={discount}
                placeholder="0"
                className="w-full bg-orange-50/50 border-2 border-transparent focus:border-orange-500 p-4 rounded-2xl transition-all outline-none font-bold text-orange-600"
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          {/* Upload Images */}
          <div className="space-y-4">
            <label className="text-sm font-black text-slate-700 mr-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-indigo-500" /> صور تفتح النفس
            </label>
            <div 
              className={`relative border-4 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer
                ${isUploading ? 'border-indigo-400 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload" type="file" multiple className="hidden"
                onChange={(e) => uploadImages(e.target.files)}
              />
              <div className="flex flex-col items-center gap-3">
                {isUploading ? (
                  <Loader2 size={48} className="text-indigo-500 animate-spin" />
                ) : (
                  <UploadCloud size={48} className="text-slate-300 group-hover:text-indigo-400" />
                )}
                <p className="text-slate-500 font-bold text-lg">اسحب الصور هنا أو اضغط للاختيار</p>
                <p className="text-xs text-slate-400">تقدر تختار أكتر من صورة (JPG, PNG)</p>
              </div>
            </div>

            {/* Preview Images */}
            <div className="flex flex-wrap gap-4 mt-6">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden group shadow-lg border-2 border-white"
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setImages(prev => prev.filter((_, idx) => idx !== i)); }}
                      className="absolute inset-0 bg-red-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || isUploading}
            onClick={addItem}
            className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl
              ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>إضافة الصنف للمنيو فوراً <CheckCircle2 size={24} /></>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}