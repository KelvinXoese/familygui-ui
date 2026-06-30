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

    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 403);

    const group = await prisma.group.findUnique({
      where: { id: groupId, isDeleted: false },
      include: { _count: { select: { members: true, meetings: true, dues: true, events: true } } },
    });
    if (!group) return errorResponse("Group not found", 404);

    return successResponse({
      group: {
        id: group.id,
        type: group.type,
        name: group.name,
        description: group.description,
        motto: group.motto,
        origin: group.origin,
        avatarUrl: group.avatarUrl,
        coverPhotoUrl: group.coverPhotoUrl,
        inviteCode: group.inviteCode,
        memberCount: group._count.members,
        myRole: membership.role,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
