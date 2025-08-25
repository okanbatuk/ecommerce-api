import { PaginationQuerySchema, VAL_MSG } from "@/shared";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const CategorySearchQuerySchema = PaginationQuerySchema.extend({
  name: z
    .string()
    .min(3, VAL_MSG.MIN("Product name"))
    .max(50, VAL_MSG.MAX("Product name", 50))
    .optional(),
  parentId: z.number().positive().finite().optional(),
});

export const categorySearchJsonSchema = zodToJsonSchema(
  CategorySearchQuerySchema,
);
export type CategorySearchType = z.infer<typeof CategorySearchQuerySchema>;
