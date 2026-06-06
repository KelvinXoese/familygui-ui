import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    if (!userId || !code) {
      return errorResponse("User ID and code are required", 400);
    }

    // Find valid OTP
    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type: "EMAIL_VERIFY",
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) {
      return errorResponse("Invalid or expired verification code", 400);
    }

    // Mark OTP as used and verify user
    await prisma.$transaction([
      prisma.otpCode.update({
        where: { id: otp.id },
        data: { isUsed: true },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      }),
    ]);

    return successResponse({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return errorResponse("Something went wrong", 500);
  }
}