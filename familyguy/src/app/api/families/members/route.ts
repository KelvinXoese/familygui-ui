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
    if (!familyId) return errorResponse("familyId required", 400);
    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 403);

    const members = await prisma.familyMember.findMany({
      where: { familyId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true,
            email: true, phone: true, avatarUrl: true, dateOfBirth: true,
            memberProfile: { select: { currentLocation: true, occupation: true, completionPercentage: true } },
          },
        },
      },
      orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
    });

    return successResponse({ members });
  } catch (error) {
    console.error("Members error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
