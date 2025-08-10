import { z } from "zod";
import { baseProductSchema } from "./index";

export const createProductSchema = baseProductSchema.extend({
  slug: z.string().regex(/^[a-z0-9-]+$/),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
