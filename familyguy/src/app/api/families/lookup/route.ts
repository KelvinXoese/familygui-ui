import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) return errorResponse("Code is required", 400);

    const family = await prisma.family.findUnique({
      where: { inviteCode: code.toUpperCase(), deletedAt: null },
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { members: true } },
      },
    });

    if (!family) return errorResponse("Family not found", 404);

    return successResponse({
      family: {
        id: family.id,
        name: family.name,
        description: family.description,
        memberCount: family._count.members,
      },
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return errorResponse("Something went wrong", 500);
  }
}