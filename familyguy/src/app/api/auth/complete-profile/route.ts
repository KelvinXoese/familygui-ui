import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);

    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);

    const { dateOfBirth } = await request.json();
    if (!dateOfBirth) return errorResponse("Date of birth is required", 400);

    await prisma.user.update({
      where: { id: payload.userId },
      data: { dateOfBirth: new Date(dateOfBirth) },
    });

    return successResponse({ message: "Profile updated" });
  } catch (error) {
    console.error("Complete profile error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
