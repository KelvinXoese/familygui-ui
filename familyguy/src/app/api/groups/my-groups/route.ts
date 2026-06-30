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

    const memberships = await prisma.groupMember.findMany({
      where: { userId: payload.userId, deletedAt: null, status: "ACTIVE" },
      include: {
        group: {
          include: { _count: { select: { members: true, posts: true } } },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const groups = memberships.map((m) => ({
      id: m.group.id,
      type: m.group.type,
      name: m.group.name,
      description: m.group.description,
      avatarUrl: m.group.avatarUrl,
      coverPhotoUrl: m.group.coverPhotoUrl,
      inviteCode: m.group.inviteCode,
      memberCount: m.group._count.members,
      postCount: m.group._count.posts,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));

    return successResponse({ groups });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
