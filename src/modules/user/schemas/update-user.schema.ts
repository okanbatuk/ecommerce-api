import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, VAL_MSG.MIN("Username"))
      .max(30, VAL_MSG.MAX("Username", 30))
      .regex(/^[a-zA-Z0-9_]+$/, VAL_MSG.USERNAME())
      .optional(),
    firstName: z
      .string()
      .min(3, VAL_MSG.MIN("First name"))
      .max(50, VAL_MSG.MAX("First name"))
      .optional(),
    lastName: z
      .string()
      .min(3, VAL_MSG.MIN("Last name"))
      .max(50, VAL_MSG.MAX("Last name"))
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: VAL_MSG.UPDATE_REQ(),
  });

export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema);

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
