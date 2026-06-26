import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createFamilySchema = z.object({
  name: z.string().min(2, "Family name must be at least 2 characters"),
  description: z.string().optional(),
  motto: z.string().optional(),
  origin: z.string().optional(),
});

export const joinFamilySchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

export const completeProfileSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  avatarUrl: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type JoinFamilyInput = z.infer<typeof joinFamilySchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;