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

    const members = await prisma.groupMember.findMany({
      where: { groupId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true,
            email: true, phone: true, avatarUrl: true, dateOfBirth: true,
            memberProfile: { select: { currentLocation: true, occupation: true } },
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return successResponse({ members, myRole: membership.role });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}

// Remove member
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);

    const { groupId, userId } = await request.json();

    const myMembership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null },
    });
    const leaderRoles = ["FAMILY_HEAD", "LEADER", "ADMIN", "SECRETARY"];
    if (!myMembership || !leaderRoles.includes(myMembership.role)) {
      return errorResponse("Not authorized to remove members", 403);
    }

    await prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId } },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });

    await prisma.notification.create({
      data: {
        userId,
        groupId,
        title: "You have been removed",
        body: "You have been removed from the group by an admin.",
        type: "MEMBER_REMOVED",
      },
    });

    return successResponse({ message: "Member removed" });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
