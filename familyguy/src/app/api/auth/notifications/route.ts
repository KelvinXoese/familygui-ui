import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const notifications = await prisma.notification.findMany({ where: { userId: payload.userId }, orderBy: { createdAt: "desc" }, take: 50 });
    return successResponse({ notifications });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
