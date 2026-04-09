import { connectDB } from "../../../lib/db";
import Order from "../../../models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find().sort({ createdAt: -1 }).lean();

  const formatted = orders.map((o: any) => ({
    ...o,
    id: o._id.toString(),
  }));

  return Response.json(formatted);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // تخزين الطلب بكل تفاصيله
    const order = await Order.create({
      deviceId: body.deviceId,        // بصمة الجهاز
      items: body.items,              // الأصناف
      orderType: body.orderType,      // دليفري ولا تربيزة
      customerInfo: body.customerInfo,// بيانات العميل (لو دليفري)
      tableNumber: body.tableNumber,  // رقم التربيزة (لو صالة)
      deliveryFee: body.deliveryFee,  // مصاريف الشحن
      total: body.total,              // الإجمالي النهائي
    });

    return Response.json(order, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Order creation failed" }, { status: 500 });
  }
}