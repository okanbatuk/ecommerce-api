import { VAL_MSG } from "@/shared";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const CategorySearchQuerySchema = z.object({
  id: z.number().positive().finite().optional(),
  search: z.string().trim().min(3, VAL_MSG.MIN("Search query")).optional(),
  name: z
    .string()
    .trim()
    .min(3, VAL_MSG.MIN("Category name"))
    .max(50, VAL_MSG.MAX("Category name", 50))
    .optional(),
  slug: z
    .string()
    .trim()
    .min(3, VAL_MSG.MIN("Category slug"))
    .max(50, VAL_MSG.MAX("Category slug", 50))
    .optional(),
  parentId: z.number().positive().finite().optional(),
  includeDeleted: z.boolean().optional(),
});

export const categorySearchJsonSchema = zodToJsonSchema(
  CategorySearchQuerySchema,
);
export type CategorySearchType = z.infer<typeof CategorySearchQuerySchema>;
