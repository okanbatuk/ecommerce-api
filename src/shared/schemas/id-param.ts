import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const idParamSchema = z.object({
  id: z.string().trim().cuid("Invalid CUID format"),
});

export const idParamJsonSchema = zodToJsonSchema(idParamSchema);

export type idParamType = z.infer<typeof idParamSchema>;
