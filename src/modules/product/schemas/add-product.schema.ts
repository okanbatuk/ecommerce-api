import { z } from "zod";
import { baseProductSchema } from "./index";
import zodToJsonSchema from "zod-to-json-schema";

export const addProductSchema = baseProductSchema;

export type AddProductInput = z.infer<typeof addProductSchema>;

export const addProductJsonSchema = zodToJsonSchema(addProductSchema);
