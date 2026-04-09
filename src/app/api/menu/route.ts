import { connectDB } from "../../../lib/db";
import Menu from "../../../models/Menu";


export async function GET() {
  try {
    await connectDB();

    const items = await Menu.find().sort({ createdAt: -1 }).lean();

    const formatted = items.map((item: any) => ({
      ...item,
      id: item._id.toString(),
    }));

    return Response.json(formatted);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error fetching menu" }, { status: 500 });
  }
}




export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("BODY:", body);

    const {
      name,
      price,
      category,
      description,
      discount,
      images,
    } = body;

    if (!name || !price) {
      return Response.json(
        { error: "name و price مطلوبين" },
        { status: 400 }
      );
    }

    const item = await Menu.create({
      name,
      price,
      category,
      description,
      discount,
      images,
    });

    return Response.json(item, { status: 201 });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return Response.json(
      { error: "حصل خطأ في السيرفر" },
      { status: 500 }
    );
  }
}