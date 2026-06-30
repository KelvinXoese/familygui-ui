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

    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 403);

    const posts = await prisma.post.findMany({
      where: { groupId, deletedAt: null },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
        reactions: true,
        comments: {
          where: { deletedAt: null },
          include: {
            author: { select: { firstName: true, lastName: true, avatarUrl: true } },
            replies: {
              where: { deletedAt: null },
              include: { author: { select: { firstName: true, lastName: true } } },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { reactions: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const postsWithMyReaction = posts.map((p) => ({
      ...p,
      myReaction: p.reactions.find((r) => r.userId === payload.userId)?.type ?? null,
    }));

    return successResponse({ posts: postsWithMyReaction });
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

    const { groupId, caption, imageUrl } = await request.json();
    if (!groupId) return errorResponse("groupId required", 400);
    if (!caption && !imageUrl) return errorResponse("Post must have a caption or image", 400);

    const membership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: payload.userId }, deletedAt: null },
    });
    if (!membership) return errorResponse("Not a member", 403);

    const post = await prisma.post.create({
      data: { groupId, authorId: payload.userId, caption, imageUrl },
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    return successResponse({ post }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
