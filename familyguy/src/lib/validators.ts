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

export const createGroupSchema = z.object({
  type: z.enum(["FAMILY", "GROUP", "ORGANIZATION"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  motto: z.string().optional(),
  origin: z.string().optional(),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;
