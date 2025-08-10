import { Rule } from "@/shared";
import { loginSchema, registerSchema } from "../schemas";

const rules: Rule[] = [
  {
    method: "POST",
    pathRegex: /^\/api\/v1\/auth\/register$/,
    schema: registerSchema,
  },
  {
    method: "POST",
    pathRegex: /^\/api\/v1\/auth\/login$/,
    schema: loginSchema,
  },
];

export default rules;
