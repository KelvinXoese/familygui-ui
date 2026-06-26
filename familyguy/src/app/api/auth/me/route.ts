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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) return errorResponse("User not found", 404);

    return successResponse({ user });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
