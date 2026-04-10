import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function requireAuth() {
  const cookieStore = await cookies(); // 👈 لازم await
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    throw new Error("Invalid token");
  }
}

export async function requireAdmin() {
  const user = await requireAuth(); // 👈 لازم await

  if ((user as any).role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
