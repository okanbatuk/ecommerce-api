import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { VAL_MSG } from "@/shared";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, VAL_MSG.MIN("Username"))
      .max(30, VAL_MSG.MAX("Username", 30))
      .regex(/^[a-zA-Z0-9_]+$/, VAL_MSG.USERNAME()),
    email: z.string().email({ message: VAL_MSG.EMAIL() }),
    password: z
      .string()
      .min(8, VAL_MSG.MIN("Password", 8))
      .regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, VAL_MSG.PASSWORD()),
    firstName: z
      .string()
      .min(3, VAL_MSG.MIN("First name"))
      .max(50, VAL_MSG.MAX("First name")),
    lastName: z
      .string()
      .min(3, VAL_MSG.MIN("Last name"))
      .max(50, VAL_MSG.MAX("Last name")),
  })
  .strict();

export const registerJsonSchema = zodToJsonSchema(registerSchema);

export type RegisterInput = z.infer<typeof registerSchema>;
