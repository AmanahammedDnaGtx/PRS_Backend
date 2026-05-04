import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
  message: "Invalid MongoDB id",
});

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("A valid email address is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const userIdParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    userId: objectIdSchema,
  }),
  query: z.object({}).optional(),
});
