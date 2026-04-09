import { connectDB } from "../../../lib/db";
import mongoose from "mongoose";

// تصحيح الموديل: شلنا كلمة new الغلط وظبطنا الأقواس
const Review = mongoose.models.Review || mongoose.model("Review", new mongoose.Schema({
    itemId: String,
    userName: { type: String, default: " عميل " },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
}));

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");
        
        const reviews = await Review.find(itemId ? { itemId } : {}).sort({ createdAt: -1 });
        return Response.json(reviews);
    } catch (err) {
        return Response.json({ error: "فشل جلب التقييمات" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { itemId, userName, rating, comment } = body;

        const newReview = await Review.create({
            itemId,
            userName: userName || " عميل",
            rating,
            comment
        });

        return Response.json(newReview, { status: 201 });
    } catch (err) {
        return Response.json({ error: "فشل إرسال التقييم" }, { status: 500 });
    }
}