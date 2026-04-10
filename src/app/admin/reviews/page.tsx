"use client";
import { useEffect, useState } from "react";
import { Trash2, Star, User, Utensils } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState<{ [key: string]: string }>({}); // تخزين الأسماء هنا
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. جلب المنيو والتقييمات مع بعض
        const [revRes, menuRes] = await Promise.all([
          fetch("/api/reviews"),
          fetch("/api/menu") // تأكد من أن هذا المسار يجلب المنيو (ID و Name)
        ]);

        const revData = await revRes.json();
        const menuData = await menuRes.json();

        // 2. تحويل المنيو لقاموس (Object) لسهولة البحث
        // النتيجة هتكون كدة: { "123": "برجر دجاج", "456": "بيتزا" }
        const menuMap: { [key: string]: string } = {};
        menuData.forEach((item: any) => {
          menuMap[item._id] = item.name;
        });

        setMenuItems(menuMap);
        setReviews(revData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteReview = async (id: string) => {
    const result = await Swal.fire({
      title: "حذف التقييم؟",
      text: "مش هتعرف ترجعه تاني يا مدير!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "أيوه، احذف",
      cancelButtonText: "إلغاء"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter((rev: any) => rev._id !== id));
        Swal.fire("تم الحذف!", "التقييم اتمسح.", "success");
      }
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">جاري تحميل التقييمات...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-gray-800 flex items-center gap-3">
        <Star className="text-yellow-500 fill-yellow-500" /> تقييمات العملاء
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev: any) => (
          <div key={rev._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < rev.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <button onClick={() => deleteReview(rev._id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>

            <p className="text-gray-700 mb-6 font-medium leading-relaxed italic">"{rev.comment}"</p>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-50 pt-4">
              <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                <User size={14}/>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{rev.userName}</span>
                <span className="text-[10px]">{new Date(rev.createdAt).toLocaleDateString("ar-EG")}</span>
              </div>
              
              <div className="mr-auto flex flex-col items-end">
                <span className="text-[10px] text-gray-400 uppercase font-bold">الوجبة</span>
                {/* هنا السحر: بنجيب الاسم من القاموس اللي عملناه فوق باستخدام الـ ID */}
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                   {menuItems[rev.itemId] || "منتج غير موجود"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}