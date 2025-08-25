import { z } from "zod";
import { addCategorySchema } from "./add-category.schema";

export const createCategorySchema = addCategorySchema.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
