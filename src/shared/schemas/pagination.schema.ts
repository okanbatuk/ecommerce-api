import { z } from "zod";

export const PaginationQuerySchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
