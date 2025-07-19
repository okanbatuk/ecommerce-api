import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters long")
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Current password must include at least one uppercase letter, one lowercase letter and one number"
      ),
    newPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters long")
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Current password must include at least one uppercase letter, one lowercase letter and one number"
      ),
  })
  .refine((val) => val.currentPassword !== val.newPassword, {
    message: "New password cannot be the same as the current password",
    path: ["new"],
  });

export const updatePasswordJsonSchema = zodToJsonSchema(updatePasswordSchema);

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
