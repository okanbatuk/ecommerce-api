import { z } from "zod";
import { addCategorySchema } from "./add-input";

export const createCategorySchema = addCategorySchema.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
});

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
