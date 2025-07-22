import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must not exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must include at least one uppercase letter, one lowercase letter and one number"
      ),
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must not exceed 50 characters"),
    lastName: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must not exceed 50 characters"),
  })
  .strict();

export const registerJsonSchema = zodToJsonSchema(registerSchema);

export type RegisterInput = z.infer<typeof registerSchema>;
