"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, CreditCard, Home, UtensilsCrossed, Plus, Minus, MapPin, User, Phone } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // States للبيانات الجديدة
  const [deliveryType, setDeliveryType] = useState<"delivery" | "in-restaurant" | null>(null);
  const [locationType, setLocationType] = useState<"near" | "far">("near");
  const [customerData, setCustomerData] = useState({ name: "", phone: "", address: "", table: "" });

  const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // منطق التوصيل: أكثر من 4 أوردرات (قطع) التوصيل مجاني
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isFreeDelivery = totalItemsCount >= 4;
  const deliveryFee = deliveryType === "delivery" ? (isFreeDelivery ? 0 : (locationType === "near" ? 30 : 50)) : 0;
  
  const finalTotal = subTotal + deliveryFee;

  // التحقق من صلاحية الزر
  const isOrderValid = () => {
    if (!deliveryType) return false;
    if (deliveryType === "in-restaurant") return customerData.table !== "";
    if (deliveryType === "delivery") return customerData.name && customerData.phone && customerData.address;
    return false;
  };


  // داخل CartPage.tsx
useEffect(() => {
  // توليد ID فريد للجهاز لو مش موجود
  let dId = localStorage.getItem("device_id");
  if (!dId) {
    dId = "dev_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("device_id", dId);
  }
}, []);

  const handleOrder = async () => {
    if (!isOrderValid()) return;
  const deviceId = localStorage.getItem("device_id"); // هنجيب الـ ID بتاع الجهاز

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ea580c', '#facc15', '#000000']
    });

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId, // بنبعت بصمة الجهاز
        items,
        orderType: deliveryType,
        customerInfo: deliveryType === "delivery" ? customerData : null,
        tableNumber: deliveryType === "in-restaurant" ? customerData.table : null,
        deliveryFee,
        total: finalTotal,
      }),
    });


      if (res.ok) {
        Swal.fire({
          title: "تم استلام طلبك!",
          text: `رقم تليفونك (${customerData.phone}) هو وسيلة تتبع الطلب`,
          icon: "success",
          confirmButtonColor: "#ea580c"
        });
        clearCart();
      }
    } catch (err) {
      console.error("Order failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-orange-600 p-3 rounded-2xl text-white shadow-lg shadow-orange-200">
            <ShoppingBag size={28} />
          </div>
          <h1 className="text-4xl font-black text-gray-900">سلة <span className="text-orange-600">المشتريات</span></h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
             <div className="text-6xl mb-4">🍕</div>
             <h2 className="text-2xl font-bold text-gray-800">سلتك فاضية يا بطل!</h2>
             <Link href="/menu">
               <button className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition">
                 اطلب دلوقتي <ArrowRight size={20} />
               </button>
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* القائمة */}
            <div className="lg:col-span-2 space-y-4 ">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm group"
                  >
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-orange-600 font-bold">{item.price} EGP</p>
                    </div>
                    
                    {/* تحكم الكمية */}
                    <div className="flex items-center bg-gray-50 rounded-2xl p-1 gap-2 text-gray-800">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-white rounded-xl transition"><Minus size={16}/></button>
                      <span className="font-black w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-white rounded-xl transition"><Plus size={16}/></button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2">
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* خيارات التوصيل */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm mt-8 text-gray-800">
                <h3 className="text-lg font-black mb-4 flex items-center text-gray-800 gap-2">وين هتاكل؟ 🧐</h3>
                <div className="grid grid-cols-2 gap-4 mb-6 text-gray-800">
                  <button 
                    onClick={() => setDeliveryType("delivery")}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${deliveryType === "delivery" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 text-gray-400"}`}
                  >
                    <Home /> <span className="font-bold">توصيل منزل</span>
                  </button>
                  <button 
                    onClick={() => setDeliveryType("in-restaurant")}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${deliveryType === "in-restaurant" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 text-gray-400"}`}
                  >
                    <UtensilsCrossed /> <span className="font-bold">داخل المطعم</span>
                  </button>
                </div>

                {/* فورم البيانات الموجهة */}
                <AnimatePresence mode="wait">
                  {deliveryType === "delivery" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-4 overflow-hidden">
                      <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl mb-4">
                        <button onClick={() => setLocationType("near")} className={`flex-1 py-2 rounded-xl font-bold ${locationType === "near" ? "bg-white shadow-sm text-orange-600" : "text-gray-400"}`}>قريب (30ج)</button>
                        <button onClick={() => setLocationType("far")} className={`flex-1 py-2 rounded-xl font-bold ${locationType === "far" ? "bg-white shadow-sm text-orange-600" : "text-gray-400"}`}>بعيد (50ج)</button>
                      </div>
                      <div className="relative">
                        <User className="absolute right-3 top-3 text-gray-400" size={18} />
                        <input type="text" placeholder="الاسم الكامل" value={customerData.name} onChange={(e) => setCustomerData({...customerData, name: e.target.value})} className="w-full pr-10 py-3 bg-gray-50 rounded-xl focus:ring-2 ring-orange-500 outline-none"/>
                      </div>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                        <input type="tel" placeholder="رقم التليفون (للمتابعة)" value={customerData.phone} onChange={(e) => setCustomerData({...customerData, phone: e.target.value})} className="w-full pr-10 py-3 bg-gray-50 rounded-xl focus:ring-2 ring-orange-500 outline-none"/>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 text-gray-400" size={18} />
                        <textarea placeholder="العنوان بالتفصيل" value={customerData.address} onChange={(e) => setCustomerData({...customerData, address: e.target.value})} className="w-full pr-10 py-3 bg-gray-50 rounded-xl focus:ring-2 ring-orange-500 outline-none h-20"/>
                      </div>
                    </motion.div>
                  )}

                  {deliveryType === "in-restaurant" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
                      <input type="number" placeholder="رقم التربيزة كام؟" value={customerData.table} onChange={(e) => setCustomerData({...customerData, table: e.target.value})} className="w-full p-4 bg-gray-50 rounded-xl focus:ring-2 ring-orange-500 outline-none font-bold text-center text-2xl"/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* الفاتورة */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] sticky top-28">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                  <CreditCard className="text-orange-500" /> ملخص الحساب
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">قيمة الطلبات</span>
                    <span>{subTotal} EGP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">التوصيل</span>
                    <span className={isFreeDelivery ? "text-green-400" : ""}>
                      {deliveryType === "delivery" ? (isFreeDelivery ? "مجاني 🎉" : `${deliveryFee} EGP`) : "0 EGP"}
                    </span>
                  </div>
                  {isFreeDelivery && deliveryType === "delivery" && <p className="text-[10px] text-green-400 text-left">خصم خاص لأكثر من 4 قطع!</p>}
                  <div className="h-[1px] bg-gray-800 my-4"></div>
                  <div className="flex justify-between text-2xl font-black">
                    <span>الإجمالي</span>
                    <span className="text-orange-500">{finalTotal} <small className="text-xs text-white">EGP</small></span>
                  </div>
                </div>

                <button
                  disabled={!isOrderValid()}
                  onClick={handleOrder}
                  className={`w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${isOrderValid() ? "bg-orange-600 hover:bg-orange-500" : "bg-gray-700 cursor-not-allowed opacity-50"}`}
                >
                  {isOrderValid() ? "تأكيد الطلب 🔥" : "أكمل البيانات أولاً"}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}