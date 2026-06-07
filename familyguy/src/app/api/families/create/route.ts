import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/auth";
import { createFamilySchema } from "@/lib/validators";
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

    const body = await request.json();
    const validation = createFamilySchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { name, description, motto, origin } = validation.data;

    // Generate unique invite code
    let inviteCode = generateInviteCode(name);
    const existing = await prisma.family.findUnique({ where: { inviteCode } });
    if (existing) inviteCode = generateInviteCode(name + Date.now());

    // Create family and add creator as Family Head
    const family = await prisma.$transaction(async (tx) => {
      const newFamily = await tx.family.create({
        data: {
          name,
          description,
          motto,
          origin,
          inviteCode,
          createdById: payload.userId,
        },
      });

      await tx.familyMember.create({
        data: {
          familyId: newFamily.id,
          userId: payload.userId,
          role: "FAMILY_HEAD",
          status: "ACTIVE",
        },
      });

      return newFamily;
    });

    return successResponse({ family }, 201);
  } catch (error) {
    console.error("Create family error:", error);
    return errorResponse("Something went wrong", 500);
  }
}