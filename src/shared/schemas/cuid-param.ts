import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const cuidParamSchema = z.object({
  id: z.string().trim().cuid("Invalid CUID format"),
});

export const cuidParamJsonSchema = zodToJsonSchema(cuidParamSchema);

export type idParamType = z.infer<typeof cuidParamSchema>;
