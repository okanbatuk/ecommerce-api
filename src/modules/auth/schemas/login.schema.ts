import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

const emailSchema = z
  .string()
  .email({ message: "Please provide a valid email address" });

export const loginSchema = z
  .object({
    identifier: z.union([usernameSchema, emailSchema]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must include at least one uppercase letter, one lowercase letter and one number"
      ),
  })
  .strict()
  .required();

export const loginJsonSchema = zodToJsonSchema(loginSchema);

export type LoginInput = z.infer<typeof loginSchema>;
