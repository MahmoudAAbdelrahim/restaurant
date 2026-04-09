"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, Plus, Check, Utensils, Zap, MessageSquare, User, Clock } from "lucide-react";
import Swal from "sweetalert2";

export default function ItemDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, items: cartItems } = useCart();
  
  const [item, setItem] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]); // حالة التقييمات
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingReview, setSendingReview] = useState(false);

  // جلب البيانات والتقييمات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, reviewsRes] = await Promise.all([
          fetch("/api/menu"),
          fetch(`/api/reviews?itemId=${id}`)
        ]);
        const menuData = await itemRes.json();
        const reviewsData = await reviewsRes.json();
        
        const found = menuData.find((i: any) => i.id === id);
        setItem(found);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // حساب المتوسط
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const isInCart = cartItems.some((cartItem) => cartItem.id === id);
  const hasDiscount = item?.discount && item.discount > 0;
  const currentPrice = hasDiscount ? item.price - (item.price * item.discount / 100) : item?.price;

  const handleReview = async () => {
    if (!comment) return Swal.fire("عذراً", "اكتب رأيك الأول!", "warning");
    setSendingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, userName, rating, comment })
      });
      if (res.ok) {
        const newRev = await res.json();
        setReviews([newRev, ...reviews]); // تحديث القائمة فوراً
        Swal.fire({ title: "شكراً!", icon: "success", timer: 1500, showConfirmButton: false });
        setComment(""); setUserName("");
      }
    } finally { setSendingReview(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!item) return <div className="text-center py-20">الوجبة غير موجودة</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 " dir="rtl" >
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-orange-600 font-bold">
          <ArrowRight size={20} /> العودة للمنيو
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* قسم الصور */}
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border">
              <img src={item.images?.[activeImage]} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <Star size={18} fill="#f97316" className="text-orange-500"/>
                <span className="font-black text-gray-900">{avgRating}</span>
                <span className="text-gray-400 text-xs">({reviews.length} تقييم)</span>
              </div>
            </div>
            {/* ...thumbnails code here (نفس اللي فات) ... */}
          </div>

          {/* قسم التفاصيل */}
          <div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">{item.name}</h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">{item.description}</p>
            
            <div className="text-4xl font-black text-orange-600 mb-10">{currentPrice} EGP</div>

            <div className="flex gap-4 mb-10">
              {isInCart ? (
                <button onClick={() => router.push("/cart")} className="flex-1 bg-green-500 text-white py-5 rounded-[2rem] font-bold shadow-lg flex items-center justify-center gap-2">
                  اذهب للسلة <Check />
                </button>
              ) : (
                <button onClick={() => addToCart({...item, price: currentPrice, quantity: 1})} className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-2">
                  أضف للسلة <Plus />
                </button>
              )}
              <button className="flex-[1.5] bg-orange-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-orange-100 flex items-center justify-center gap-2">
                اطلب الآن <Utensils />
              </button>
            </div>

            {/* فورم التقييم */}
            <div className="bg-gray-50 p-6 rounded-[2rem] border text-gray-500">
              <h3 className="font-bold mb-4">اكتب رأيك</h3>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} onClick={() => setRating(s)} size={24} fill={s <= rating ? "#f97316" : "none"} className="cursor-pointer text-orange-500"/>)}
              </div>
              <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="اسمك (اختياري)" className="w-full p-3 rounded-xl mb-3 outline-none focus:ring-1 ring-orange-500" />
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="رأيك في الأكلة..." className="w-full p-3 rounded-xl mb-3 outline-none h-20 focus:ring-1 ring-orange-500" />
              <button onClick={handleReview} disabled={sendingReview} className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">
                {sendingReview ? "جاري الإرسال..." : "إرسال التقييم"}
              </button>
            </div>
          </div>
        </div>

        {/* قسم عرض الكومنتات (تحت الصور والتفاصيل) */}
        <div className="border-t pt-12">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-gray-500">
            ماذا قالوا عن <span className="text-orange-600">{item.name}</span>؟ 💬
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <motion.div key={rev._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                          {rev.userName[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{rev.userName}</h4>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "#f97316" : "none"} className="text-orange-500"/>)}
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-300 text-xs flex items-center gap-1">
                        <Clock size={12}/> {new Date(rev.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">"{rev.comment}"</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full text-center py-10">لسه مفيش تقييمات.. كن أول من يجرب! ✨</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}