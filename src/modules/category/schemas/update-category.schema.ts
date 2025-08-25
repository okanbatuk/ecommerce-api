import { z } from "zod";
import { VAL_MSG } from "@/shared";

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, VAL_MSG.MIN("Product name"))
    .max(50, VAL_MSG.MAX("Product name", 50))
    .optional(),
  parentId: z.number().positive().finite().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
