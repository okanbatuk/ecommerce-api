import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const idParamSchema = z.object({
  id: z.string().cuid("Invalid CUID format"),
});

export const idParamJsonSchema = zodToJsonSchema(idParamSchema);
