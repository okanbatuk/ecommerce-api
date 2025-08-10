import { Rule } from "@/shared";
import { updatePasswordSchema, updateUserSchema } from "../schemas";

const rules: Rule[] = [
  {
    method: "PATCH",
    pathRegex: /^\/api\/v1\/users\/[^\/]+$/,
    schema: updateUserSchema,
  },
  {
    method: "PATCH",
    pathRegex: /^\/api\/v1\/users\/[^\/]+\/password$/,
    schema: updatePasswordSchema,
  },
];

export default rules;
