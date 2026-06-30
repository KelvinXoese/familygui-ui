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

    const { postId, type } = await request.json();

    const existing = await prisma.postReaction.findUnique({
      where: { postId_userId: { postId, userId: payload.userId } },
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.postReaction.delete({ where: { postId_userId: { postId, userId: payload.userId } } });
        return successResponse({ action: "removed" });
      } else {
        await prisma.postReaction.update({
          where: { postId_userId: { postId, userId: payload.userId } },
          data: { type },
        });
        return successResponse({ action: "updated" });
      }
    }

    await prisma.postReaction.create({ data: { postId, userId: payload.userId, type } });
    return successResponse({ action: "added" });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
