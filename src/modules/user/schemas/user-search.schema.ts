import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { PaginationQuerySchema, VAL_MSG } from "@/shared";

export const UserSearchQuerySchema = PaginationQuerySchema.extend({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/, VAL_MSG.USERNAME())
    .optional(),
  email: z.string().email({ message: VAL_MSG.EMAIL() }).optional(),
});

export const searchQueryJsonSchema = zodToJsonSchema(UserSearchQuerySchema);

export type UserSearchQueryType = z.infer<typeof UserSearchQuerySchema>;
