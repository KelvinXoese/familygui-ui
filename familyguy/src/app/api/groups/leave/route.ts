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

    const { groupId } = await request.json();

    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 400);

    await prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId: payload.userId } },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });

    return successResponse({ message: "Left successfully" });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
