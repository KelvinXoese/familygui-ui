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
    const membership = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const meetings = await prisma.meeting.findMany({
      where: { groupId, deletedAt: null },
      include: { _count: { select: { attendances: true } } },
      orderBy: { date: "asc" },
    });
    return successResponse({ meetings });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const { groupId, title, date, startTime, endTime, type, location, agenda } = await request.json();
    if (!groupId || !title || !date || !startTime || !endTime || !type || !location) return errorResponse("Missing fields", 400);
    const membership = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const meeting = await prisma.meeting.create({
      data: { groupId, createdById: payload.userId, title, date: new Date(date), startTime, endTime, type, location, agenda: agenda || [] },
    });
    return successResponse({ meeting }, 201);
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
