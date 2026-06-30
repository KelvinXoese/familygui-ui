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

    const { inviteCode } = await request.json();
    if (!inviteCode) return errorResponse("Invite code is required", 400);

    const group = await prisma.group.findUnique({ where: { inviteCode, isDeleted: false } });
    if (!group) return errorResponse("Invalid invite code", 404);

    const existing = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId: group.id, userId: payload.userId }, deletedAt: null },
    });
    if (existing) return errorResponse("You are already a member", 400);

    const member = await prisma.groupMember.create({
      data: { groupId: group.id, userId: payload.userId, role: "MEMBER", status: "ACTIVE" },
    });

    // Notify leaders
    const leaders = await prisma.groupMember.findMany({
      where: {
        groupId: group.id,
        deletedAt: null,
        role: { in: ["FAMILY_HEAD", "LEADER", "ADMIN", "SECRETARY"] },
      },
      select: { userId: true },
    });

    const joiner = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { firstName: true, lastName: true },
    });

    if (leaders.length > 0 && joiner) {
      await prisma.notification.createMany({
        data: leaders.map((l) => ({
          userId: l.userId,
          groupId: group.id,
          title: "New member joined",
          body: `${joiner.firstName} ${joiner.lastName} joined ${group.name}`,
          type: "MEMBER_JOINED",
        })),
      });
    }

    return successResponse({ member, group });
  } catch (error) {
    console.error("Join group error:", error instanceof Error ? error.message : error);
    return errorResponse("Something went wrong", 500);
  }
}
