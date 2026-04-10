import { connectDB } from "../../../lib/db";
import mongoose from "mongoose";

// تعريف الموديل
const ReviewSchema = new mongoose.Schema({
    itemId: String, // هنا هيكون إما ID الوجبة أو كلمة "website"
    userName: { type: String, default: "عميل" },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { itemId, userName, rating, comment } = body;

        const newReview = await Review.create({
            itemId: itemId || "general",
            userName: userName || "عميل",
            rating,
            comment
        });

        return Response.json({ success: true, data: newReview }, { status: 201 });
    } catch (err) {
        return Response.json({ error: "فشل إرسال التقييم" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");

        // لو باعت itemId معين هيجيبه، لو مش باعت هيجيب كل الريفيوهات (للأدمن)
        const query = itemId ? { itemId } : {};
        const reviews = await Review.find(query).sort({ createdAt: -1 });
        
        return Response.json(reviews);
    } catch (err) {
        return Response.json({ error: "فشل جلب البيانات" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        await Review.findByIdAndDelete(id);
        return Response.json({ success: true, message: "تم الحذف بنجاح" });
    } catch (err) {
        return Response.json({ error: "فشل عملية الحذف" }, { status: 500 });
    }
}