import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

export const UserSearchQuerySchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, VAL_MSG.USERNAME())
    .optional(),
  email: z.string().email({ message: VAL_MSG.EMAIL() }).optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const searchQueryJsonSchema = zodToJsonSchema(UserSearchQuerySchema);

export type UserSearchQueryType = z.infer<typeof UserSearchQuerySchema>;
