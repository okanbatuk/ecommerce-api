import { z } from "zod";
import { VAL_MSG } from "@/shared";
import zodToJsonSchema from "zod-to-json-schema";

export const addCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, VAL_MSG.MIN("Product name"))
    .max(50, VAL_MSG.MAX("Product name", 50)),
  parentId: z.number().positive().finite().optional(),
});

export const addCategoryJsonSchema = zodToJsonSchema(addCategorySchema);

export type AddCategoryInput = z.infer<typeof addCategorySchema>;
