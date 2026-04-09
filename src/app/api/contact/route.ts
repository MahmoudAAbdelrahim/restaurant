import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, phone, message } = await req.json();

    const newMessage = await Contact.create({ name, phone, message });

    return NextResponse.json({ success: true, message: "تم استلام رسالتك بنجاح" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "حدث خطأ في الإرسال" }, { status: 500 });
  }
}