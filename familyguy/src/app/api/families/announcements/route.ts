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

    const announcements = await prisma.announcement.findMany({
      where: { familyId, deletedAt: null },
      include: { author: { select: { firstName: true, lastName: true } } },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return successResponse({ announcements });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);

    const { familyId, title, body } = await request.json();
    if (!familyId || !title || !body) return errorResponse("Missing required fields", 400);

    const membership = await prisma.familyMember.findUnique({
      where: { familyId_userId: { familyId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 403);

    const announcement = await prisma.announcement.create({
      data: { familyId, authorId: payload.userId, title, body },
    });

    return successResponse({ announcement }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
