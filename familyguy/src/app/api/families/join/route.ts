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

    // Find family
    const family = await prisma.family.findUnique({
      where: { inviteCode: inviteCode.toUpperCase(), deletedAt: null },
    });

    if (!family) return errorResponse("Invalid invite code", 404);

    // Check if already a member
    const existing = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId: family.id, userId: payload.userId } },
    });

    if (existing) return errorResponse("You are already a member of this family", 409);

    // Join family
    await prisma.familyMember.create({
      data: {
        familyId: family.id,
        userId: payload.userId,
        role: "MEMBER",
        status: "ACTIVE",
      },
    });

    return successResponse({ family });
  } catch (error) {
    console.error("Join family error:", error);
    return errorResponse("Something went wrong", 500);
  }
}