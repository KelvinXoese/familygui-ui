import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    if (!groupId) return errorResponse("groupId required", 400);
    const membership = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const documents = await prisma.archiveDocument.findMany({
      where: { groupId, deletedAt: null },
      include: { uploadedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
    return successResponse({ documents });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
