import { z } from "zod";
import { VAL_MSG } from "@/shared";

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, VAL_MSG.MIN("Category name"))
    .max(50, VAL_MSG.MAX("Category name", 50))
    .optional(),
  parentId: z.number().positive().finite().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
