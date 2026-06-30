import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    await prisma.notification.updateMany({ where: { userId: payload.userId, isRead: false }, data: { isRead: true } });
    return successResponse({ message: "ok" });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
