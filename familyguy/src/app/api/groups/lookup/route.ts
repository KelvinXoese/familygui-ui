import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (!code) return errorResponse("Code required", 400);

    const group = await prisma.group.findUnique({
      where: { inviteCode: code.toUpperCase(), isDeleted: false },
      include: { _count: { select: { members: true } } },
    });

    if (!group) return errorResponse("Invalid invite code. No group found.", 404);

    return successResponse({
      group: {
        id: group.id,
        name: group.name,
        type: group.type,
        description: group.description,
        inviteCode: group.inviteCode,
        memberCount: group._count.members,
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
