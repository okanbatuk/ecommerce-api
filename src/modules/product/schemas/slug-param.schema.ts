import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const SlugParamSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens.",
  }),
});

export const slugParamJsonSchema = zodToJsonSchema(SlugParamSchema);

export type SlugParam = z.infer<typeof SlugParamSchema>;
