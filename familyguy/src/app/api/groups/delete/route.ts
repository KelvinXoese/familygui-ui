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

    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) return errorResponse("Group not found", 404);
    if (group.createdById !== payload.userId) return errorResponse("Only the creator can delete", 403);

    await prisma.group.update({
      where: { id: groupId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return successResponse({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
