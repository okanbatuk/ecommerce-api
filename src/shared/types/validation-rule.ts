import { z } from "zod";

export type Rule = {
  method: string;
  pathPrefix: string;
  schema: z.ZodSchema<any>;
};
