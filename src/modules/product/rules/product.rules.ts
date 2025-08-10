import { Rule } from "@/shared";
import { addProductSchema, updateProductSchema } from "../schemas";

const rules: Rule[] = [
  {
    method: "POST",
    pathRegex: /^\/api\/v1\/products$/,
    schema: addProductSchema,
  },
  {
    method: "PATCH",
    pathRegex: /^\/api\/v1\/products\/[^\/]+$/,
    schema: updateProductSchema,
  },
];

export default rules;
