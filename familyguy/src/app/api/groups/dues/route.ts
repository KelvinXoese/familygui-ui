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
    const dues = await prisma.due.findMany({
      where: { groupId, deletedAt: null },
      include: { payments: { where: { userId: payload.userId } }, _count: { select: { payments: true } } },
      orderBy: { deadline: "asc" },
    });
    const group = await prisma.group.findUnique({ where: { id: groupId }, include: { _count: { select: { members: true } } } });
    const totalMembers = group?._count.members ?? 0;
    return successResponse({ dues: dues.map((d) => ({ ...d, totalMembers, myStatus: d.payments[0]?.paymentStatus ?? "PENDING" })) });
  } catch (e) { return errorResponse("Something went wrong", 500); }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const { groupId, title, description, amount, currency, deadline, type } = await request.json();
    if (!groupId || !title || !amount || !deadline || !type) return errorResponse("Missing fields", 400);
    const membership = await prisma.groupMember.findUnique({ where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const due = await prisma.due.create({
      data: { groupId, createdById: payload.userId, title, description, amount: parseFloat(amount), currency: currency || "GHS", deadline: new Date(deadline), type },
    });
    return successResponse({ due }, 201);
  } catch (e) { return errorResponse("Something went wrong", 500); }
}
