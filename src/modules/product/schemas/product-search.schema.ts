import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

export const ProductSearchQuerySchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]{3,}$/, VAL_MSG.MIN("Product name"))
    .optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const searchQueryJsonSchema = zodToJsonSchema(ProductSearchQuerySchema);

export type productSearchType = z.infer<typeof ProductSearchQuerySchema>;
