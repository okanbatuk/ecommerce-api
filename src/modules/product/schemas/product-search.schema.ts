import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { PaginationQuerySchema, VAL_MSG } from "@/shared";

export const ProductSearchQuerySchema = PaginationQuerySchema.extend({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9 ]{3,}$/, VAL_MSG.MIN("Product name"))
    .optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const searchQueryJsonSchema = zodToJsonSchema(ProductSearchQuerySchema);

export type ProductSearchType = z.infer<typeof ProductSearchQuerySchema>;
