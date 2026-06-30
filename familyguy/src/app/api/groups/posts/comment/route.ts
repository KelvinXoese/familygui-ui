import { prisma } from "@/lib/prisma";
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

    const { postId, body, parentCommentId } = await request.json();
    if (!postId || !body) return errorResponse("Missing fields", 400);

    if (parentCommentId) {
      const reply = await prisma.commentReply.create({
        data: { commentId: parentCommentId, authorId: payload.userId, body },
        include: { author: { select: { firstName: true, lastName: true } } },
      });
      return successResponse({ reply }, 201);
    }

    const comment = await prisma.postComment.create({
      data: { postId, authorId: payload.userId, body },
      include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } }, replies: true },
    });

    return successResponse({ comment }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", 500);
  }
}
