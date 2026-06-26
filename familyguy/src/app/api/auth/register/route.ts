import { prisma } from "@/lib/prisma";
import { hashPassword, generateOTP } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { successResponse, errorResponse } from "@/lib/response";
import { AuthProvider } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
  const msg = validation.error?.errors?.[0]?.message ?? "Invalid input";
  return errorResponse(msg, 400);
}

    const { firstName, lastName, email, phone, password } = validation.data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("An account with this email already exists", 409);
    }

    // Check if phone already exists
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return errorResponse("An account with this phone number already exists", 409);
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user and OTP in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          passwordHash,
          authProvider: AuthProvider.EMAIL,
          isVerified: false,
        },
      });

      // Create OTP
      await tx.otpCode.create({
        data: {
          userId: newUser.id,
          code: otp,
          type: "EMAIL_VERIFY",
          expiresAt: otpExpiry,
        },
      });

      // Create empty member profile
      await tx.memberProfile.create({
        data: {
          userId: newUser.id,
          completionPercentage: 0,
        },
      });

      return newUser;
    });

    // TODO: Send OTP email (we'll add email service next)
    console.log(`OTP for ${email}: ${otp}`); // Remove in production

    return successResponse(
      {
        message: "Account created successfully. Please verify your email.",
        userId: user.id,
        email: user.email,
        // In production, never return OTP — send via email
        // This is only for development testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      },
      201
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}