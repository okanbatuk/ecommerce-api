import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

const usernameSchema = z
  .string()
  .min(3, VAL_MSG.MIN("Username"))
  .max(30, VAL_MSG.MAX("Username", 30))
  .regex(/^[a-zA-Z0-9_]+$/, VAL_MSG.USERNAME());

const emailSchema = z.string().email({ message: VAL_MSG.EMAIL() });

export const loginSchema = z
  .object({
    identifier: z.union([usernameSchema, emailSchema]),
    password: z
      .string()
      .min(8, VAL_MSG.MIN("Password", 8))
      .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, VAL_MSG.PASSWORD()),
  })
  .strict()
  .required();

export const loginJsonSchema = zodToJsonSchema(loginSchema);

export type LoginInput = z.infer<typeof loginSchema>;
