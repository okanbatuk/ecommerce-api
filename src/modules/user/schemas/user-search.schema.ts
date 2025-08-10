import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const UserSearchQuerySchema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]{3,}$/,
      "Username must be at least 3 chars (a-z, 0-9, _)",
    )
    .optional(),
  email: z.string().min(3, "Email search must be at least 3 chars").optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const searchQueryJsonSchema = zodToJsonSchema(UserSearchQuerySchema);
