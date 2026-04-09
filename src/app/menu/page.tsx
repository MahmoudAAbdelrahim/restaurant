"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../store/cart";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Zap, Plus, ArrowRight, Utensils, Coffee } from "lucide-react";
import Swal from "sweetalert2";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  finalPrice?: number;
  description?: string;
  discount?: number;
  category: string;
  images?: string[];
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart, items: cartItems } = useCart();
  const params = useSearchParams();
  const router = useRouter();
  
  // الحصول على رقم الطاولة من الرابط أو التخزين المحلي
  const tableFromUrl = params.get("table");
  const [tableNumber, setTableNumber] = useState<string>("");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data: MenuItem[]) => setItems(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const savedTable = localStorage.getItem("table");
    if (tableFromUrl) {
      localStorage.setItem("table", tableFromUrl);
      setTableNumber(tableFromUrl);
    } else if (savedTable) {
      setTableNumber(savedTable);
    }
  }, [tableFromUrl]);

  const isInCart = (id: string) => cartItems.some((cartItem) => cartItem.id === id);

  // دالة الطلب المباشر من داخل المطعم
  const handleDirectOrder = async (item: MenuItem) => {
    if (!tableNumber) {
      Swal.fire({
        title: "عذراً!",
        text: "هذا الزر مخصص للطلب السريع داخل المطعم فقط. يرجى مسح QR الطاولة أولاً.",
        icon: "warning",
        confirmButtonText: "مفهوم",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'تأكيد طلب سريع',
      html:
        `<div class="flex flex-col gap-3 font-sans">
          <p class="text-sm text-gray-600">أنت تطلب الآن: <b>${item.name}</b></p>
          <input id="swal-name" class="swal2-input" placeholder="اسمك الكريم">
          <input id="swal-qty" class="swal2-input" placeholder="الكمية (مثال: 1 أو نص كيلو)">
          <input id="swal-table" class="swal2-input" value="${tableNumber}" placeholder="رقم الطاولة" readonly>
        </div>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'تأكيد الطلب ✅',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ea580c',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const qty = (document.getElementById('swal-qty') as HTMLInputElement).value;
        if (!name || !qty) {
          Swal.showValidationMessage('يرجى كتابة الاسم والكمية');
        }
        return { name, qty, table: tableNumber };
      }
    });

    if (formValues) {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          body: JSON.stringify({
            items: [{ 
              id: item.id, 
              name: item.name, 
              price: item.discount ? (item.price - (item.price * item.discount / 100)) : item.price, 
              quantity: formValues.qty 
            }],
            customerName: formValues.name,
            tableNumber: formValues.table,
            orderType: "direct"
          }),
        });

        if (res.ok) {
          Swal.fire({
            title: 'تم الطلب بنجاح! 🎉',
            text: 'طلبك قيد التحضير وسيصل لطاولتك قريباً.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire('خطأ', 'حدثت مشكلة أثناء إرسال الطلب', 'error');
      }
    }
  };

  // تقسيم المنتجات حسب التصنيف
  const categories = Array.from(new Set(items.map((i) => i.category)));

  if (loading) return <div className="text-center py-20 font-bold">جاري تحميل القائمة...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 font-sans mt-15">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-right">
          <span className="text-orange-600 font-bold tracking-widest text-sm bg-orange-50 px-4 py-2 rounded-full">منيو المطعم</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">
            استمتع بأشهى <span className="text-orange-500">المأكولات</span>
          </h1>
        </div>

        {/* Categories Sections */}
        {categories.map((cat) => (
          <div key={cat} className="mb-16">
            <div className="flex items-center gap-3 mb-8 border-r-4 border-orange-500 pr-4">
              {cat.includes("مشروب") ? <Coffee className="text-orange-500" /> : <Utensils className="text-orange-500" />}
              <h2 className="text-3xl font-black text-gray-800">{cat}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.filter(i => i.category === cat).map((item) => {
                const hasDiscount = item.discount && item.discount > 0;
                const currentPrice = hasDiscount 
                  ? item.price - (item.price * (item.discount || 0) / 100) 
                  : item.price;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                  >
                    {/* Image */}
                    <div 
                      className="relative h-56 cursor-pointer overflow-hidden"
                      onClick={() => router.push(`/menu/${item.id}`)}
                    >
                      <img
                        src={item.images?.[0] || "https://via.placeholder.com/300"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.name}
                      />
                      {hasDiscount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 shadow-lg">
                          <Zap size={12} fill="white" /> {item.discount}% خصم
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 
                        className="text-lg font-bold text-gray-800 mb-1 cursor-pointer hover:text-orange-600 transition-colors"
                        onClick={() => router.push(`/menu/${item.id}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-1">{item.description}</p>

                      <div className="flex items-baseline gap-2 mb-5">
                        <span className="text-xl font-black text-orange-600">{currentPrice} EGP</span>
                        {hasDiscount && (
                          <span className="text-sm text-gray-400 line-through">{item.price} EGP</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {/* أضف للسلة */}
                        <button
                          onClick={() => addToCart({
                            id: item.id,
                            name: item.name,
                            price: currentPrice,
                            image: item.images?.[0],
                            quantity: 1,
                          })}
                          className={`p-3 rounded-xl border transition-all ${
                            isInCart(item.id) 
                            ? "bg-green-50 border-green-200 text-green-600" 
                            : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {isInCart(item.id) ? <ArrowRight size={20} onClick={() => router.push('/cart')} /> : <Plus size={20} />}
                        </button>

                        {/* اطلب الآن */}
                        <button
                          onClick={() => handleDirectOrder(item)}
                          className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          اطلب الآن <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}