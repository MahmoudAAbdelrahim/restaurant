"use client";
import { useEffect, useState } from "react";
import { Trash2, Phone, User, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const res = await fetch("/api/contact");
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => { fetchMessages(); }, []);

  const deleteMessage = async (id: string) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تستطيع استعادة هذه الرسالة!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      confirmButtonText: "نعم، احذفها"
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((msg: any) => msg._id !== id));
        Swal.fire("تم الحذف!", "تم إزالة الرسالة بنجاح.", "success");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-black mb-8 text-gray-800 flex items-center gap-3">
        <MessageSquare className="text-orange-600" /> بريد الرسائل
      </h1>
      
      <div className="grid gap-6">
        {messages.map((msg: any) => (
          <div key={msg._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1 font-bold text-gray-900"><User size={16}/> {msg.name}</span>
                <span className="flex items-center gap-1"><Phone size={16}/> {msg.phone}</span>
                <span>{new Date(msg.createdAt).toLocaleDateString("ar-EG")}</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{msg.message}</p>
            </div>
            <button onClick={() => deleteMessage(msg._id)} className="text-red-500 hover:bg-red-50 p-3 rounded-2xl transition">
              <Trash2 size={22} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}