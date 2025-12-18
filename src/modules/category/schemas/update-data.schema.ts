import { z } from "zod";
import { updateCategorySchema } from "./update-input.schema";

export const updateCategoryDataSchema = updateCategorySchema.extend({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});
export type UpdateCategoryData = z.infer<typeof updateCategoryDataSchema>;
