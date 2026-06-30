import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/auth";
import { createGroupSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

const defaultRoles: Record<string, string> = {
  FAMILY: "FAMILY_HEAD",
  GROUP: "LEADER",
  ORGANIZATION: "ADMIN",
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);

    const body = await request.json();
    const validation = createGroupSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error?.errors?.[0]?.message ?? "Invalid input", 400);
    }

    const { type, name, description, motto, origin } = validation.data;

    let inviteCode = generateInviteCode(name);
    const existing = await prisma.group.findUnique({ where: { inviteCode } });
    if (existing) inviteCode = generateInviteCode(name + Date.now());

    const group = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.group.create({
        data: { type, name, description, motto, origin, inviteCode, createdById: payload.userId },
      });

      await tx.groupMember.create({
        data: {
          groupId: newGroup.id,
          userId: payload.userId,
          role: defaultRoles[type] || "MEMBER",
          status: "ACTIVE",
        },
      });

      return newGroup;
    });

    return successResponse({ group }, 201);
  } catch (error) {
    console.error("Create group error:", error instanceof Error ? error.message : error);
    return errorResponse("Something went wrong", 500);
  }
}
