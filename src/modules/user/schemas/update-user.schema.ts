import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const updateUserSchema = z
  .object({
    username: z.string().min(3).optional(),
    firstName: z.string().min(3).optional(),
    lastName: z.string().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

  export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema)

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
