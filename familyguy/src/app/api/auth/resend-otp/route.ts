import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) return errorResponse("User ID is required", 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return errorResponse("User not found", 404);
    if (user.isVerified) return errorResponse("Email already verified", 400);

    // Invalidate old OTPs
    await prisma.otpCode.updateMany({
      where: { userId, type: "EMAIL_VERIFY", isUsed: false },
      data: { isUsed: true },
    });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: { userId, code: otp, type: "EMAIL_VERIFY", expiresAt: otpExpiry },
    });

    console.log(`Resend OTP for ${user.email}: ${otp}`);

    return successResponse({
      message: "Verification code resent",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
