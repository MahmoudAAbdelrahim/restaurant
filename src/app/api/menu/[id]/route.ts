import { connectDB } from "../../../../lib/db";
import Menu from "../../../../models/Menu";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return Response.json({ error: "Invalid ID" }, { status: 400 });
  }

  await connectDB();
  await Menu.findByIdAndDelete(id);

  return Response.json({ message: "Deleted" });
}


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

  const updated = await Menu.findByIdAndUpdate(id, body, {
    new: true,
  });

  return Response.json(updated);
}