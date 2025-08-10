import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { Role, VAL_MSG } from "@/shared";
import { registerSchema } from "@/modules/auth/schemas";

export const createUserSchema = registerSchema
  .extend({
    role: z.nativeEnum(Role).default(Role.USER),
  })
  .strict();

export const createUserJsonSchema = zodToJsonSchema(createUserSchema);

export type CreateUserInput = z.infer<typeof createUserSchema>;
