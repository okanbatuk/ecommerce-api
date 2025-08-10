import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, VAL_MSG.MIN("Current password", 8))
      .max(50, VAL_MSG.MAX("Current password"))
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        VAL_MSG.PASSWORD("Current password"),
      ),
    newPassword: z
      .string()
      .min(8, VAL_MSG.MIN("New password", 8))
      .max(50, VAL_MSG.MAX("New Password"))
      .regex(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        VAL_MSG.PASSWD_REQ("New password"),
      ),
  })
  .refine((val) => val.currentPassword !== val.newPassword, {
    message: VAL_MSG.NO_MATCH(),
    path: ["new"],
  });

export const updatePasswordJsonSchema = zodToJsonSchema(updatePasswordSchema);

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
