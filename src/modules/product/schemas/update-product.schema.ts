import { z } from "zod";
import { createProductSchema } from "./create-product.schema";
import { VAL_MSG } from "@/shared";
import zodToJsonSchema from "zod-to-json-schema";

export const updateProductSchema = createProductSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: VAL_MSG.UPDATE_REQ(),
  });

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const updateProductJsonSchema = zodToJsonSchema(updateProductSchema);
