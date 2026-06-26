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

    const memberships = await prisma.familyMember.findMany({
      where: {
        userId: payload.userId,
        deletedAt: null,
        status: "ACTIVE",
      },
      include: {
        family: {
          include: {
            _count: { select: { members: true } },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const families = memberships.map((m) => ({
      id: m.family.id,
      name: m.family.name,
      description: m.family.description,
      inviteCode: m.family.inviteCode,
      memberCount: m.family._count.members,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));

    return successResponse({ families });
  } catch (error) {
    console.error("My families error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
