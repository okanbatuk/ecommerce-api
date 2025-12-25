import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const intIdParamSchema = z.object({
  id: z.number().positive().finite(),
});

export const intIdParamJsonSchema = zodToJsonSchema(intIdParamSchema);

export type idParamType = z.infer<typeof intIdParamSchema>;
