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
    const familyId = searchParams.get("familyId");
    if (!familyId) return errorResponse("familyId is required", 400);

    // Confirm user is a member
    const membership = await prisma.familyMember.findUnique({
      where: {
        familyId_userId: { familyId, userId: payload.userId },
        deletedAt: null,
      },
    });
    if (!membership) return errorResponse("Not a member of this family", 403);

    const family = await prisma.family.findUnique({
      where: { id: familyId, deletedAt: null },
      include: {
        _count: {
          select: {
            members: true,
            meetings: true,
            dues: true,
            events: true,
          },
        },
      },
    });

    if (!family) return errorResponse("Family not found", 404);

    return successResponse({
      family: {
        id: family.id,
        name: family.name,
        description: family.description,
        motto: family.motto,
        origin: family.origin,
        inviteCode: family.inviteCode,
        memberCount: family._count.members,
        myRole: membership.role,
      },
    });
  } catch (error) {
    console.error("Active family error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
