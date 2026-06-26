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
    const membership = await prisma.familyMember.findUnique({ where: { familyId_userId: { familyId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);

    const dues = await prisma.due.findMany({
      where: { familyId, deletedAt: null },
      include: {
        payments: { where: { userId: payload.userId } },
        _count: { select: { payments: true } },
      },
      orderBy: { deadline: "asc" },
    });
    const family = await prisma.family.findUnique({ where: { id: familyId }, include: { _count: { select: { members: true } } } });
    const totalMembers = family?._count.members ?? 0;
    const duesWithStatus = dues.map((d) => ({
      ...d,
      totalMembers,
      myPayment: d.payments[0] ?? null,
      myStatus: d.payments[0]?.paymentStatus ?? "PENDING",
    }));
    return successResponse({ dues: duesWithStatus });
  } catch (e) { console.error(e); return errorResponse("Something went wrong", 500); }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return errorResponse("Unauthorized", 401);
    const payload = verifyToken(token);
    if (!payload) return errorResponse("Unauthorized", 401);
    const { familyId, title, description, amount, currency, deadline, type } = await request.json();
    if (!familyId || !title || !amount || !deadline || !type) return errorResponse("Missing required fields", 400);
    const membership = await prisma.familyMember.findUnique({ where: { familyId_userId: { familyId, userId: payload.userId }, deletedAt: null } });
    if (!membership) return errorResponse("Not a member", 403);
    const due = await prisma.due.create({
      data: { familyId, createdById: payload.userId, title, description, amount: parseFloat(amount), currency: currency || "GHS", deadline: new Date(deadline), type },
    });
    return successResponse({ due }, 201);
  } catch (e) { console.error(e); return errorResponse("Something went wrong", 500); }
}
