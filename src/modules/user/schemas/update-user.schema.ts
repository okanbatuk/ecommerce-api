import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(30, "Username must not exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional(),
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must not exceed 50 characters")
      .optional(),
    lastName: z
      .string()
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must not exceed 50 characters")
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema);

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
