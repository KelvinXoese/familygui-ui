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
    const profile = await prisma.familyTreeProfile.findUnique({ where: { userId_groupId: { userId: payload.userId, groupId } } });
    const children = await prisma.familyTreeChild.findMany({ where: { parentUserId: payload.userId, groupId, deletedAt: null } });
    return successResponse({ profile, children });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const { groupId, parentUserId, parentName, parentStatus, children } = await request.json();
    if (!groupId) return errorResponse("groupId required", 400);
    const membership = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const profile = await prisma.familyTreeProfile.upsert({
      where: { userId_groupId: { userId: payload.userId, groupId } },
      create: { userId: payload.userId, groupId, parentUserId: parentUserId || null, parentName: parentName || null, parentStatus: parentStatus || null },
      update: { parentUserId: parentUserId || null, parentName: parentName || null, parentStatus: parentStatus || null },
    });
    if (children && children.length > 0) {
      for (const child of children) {
        if (child.name) await prisma.familyTreeChild.create({ data: { parentUserId: payload.userId, groupId, childName: child.name } });
      }
    }
    return successResponse({ profile });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
