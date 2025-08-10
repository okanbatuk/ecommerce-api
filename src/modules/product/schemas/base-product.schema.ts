import { VAL_MSG } from "@/shared";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const baseProductSchema = z.object({
  name: z
    .string()
    .min(3, VAL_MSG.MIN("Product name"))
    .max(50, VAL_MSG.MAX("Product name", 50)),
  description: z.string().optional(),
  price: z.number().positive().finite(),
  stock: z.number().int().min(0).max(999_999),
  isActive: z.boolean().optional().default(true),
});
