import { prisma } from "@/lib/prisma";
import { verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/response";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.errors[0].message, 400);
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        passwordHash: true,
        isVerified: true,
        authProvider: true,
      },
    });

    if (!user) return errorResponse("Invalid email or password", 401);
    if (!user.passwordHash) return errorResponse("Please sign in with Google or Apple", 401);

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) return errorResponse("Invalid email or password", 401);

    // If not verified, return userId so frontend can redirect to verify-email
    if (!user.isVerified) {
      return errorResponse("Please verify your email before signing in. Check your inbox for a 6-digit code.", 403, user.id);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return successResponse({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
