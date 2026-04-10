import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export function requireAuth() {
const cookieStore = cookies();
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

export function requireAdmin() {
  const user = requireAuth();

  if ((user as any).role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}