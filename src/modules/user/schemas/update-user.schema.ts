import { z } from "zod";
import fp from "fastify-plugin";
import zodToJsonSchema from "zod-to-json-schema";

export const updateUserSchema = z
  .object({
    username: z.string().min(3).optional(),
    firstName: z.string().min(3).optional(),
    lastName: z.string().optional(),
    password: z.string().min(8).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema, {
  target: "jsonSchema7",
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
