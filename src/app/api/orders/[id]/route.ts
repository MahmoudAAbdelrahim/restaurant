import { connectDB } from "../../../../lib/db";
import Order from "../../../../models/Order";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  await connectDB();

  const body = await req.json();

  const updated = await Order.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true }
  );

  return Response.json(updated);
}