import { z } from "zod";

export type Rule = {
  method: string;
  pathRegex: RegExp;
  schema: z.ZodSchema<any>;
};
