import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Rule } from "../types/validation-rule";
import { sendReply } from "../utils/send-response";
import { ResponseCode } from "../types/response-code";
import authRules from "@/modules/auth/rules/auth.rules";
import userRules from "@modules/user/rules/user.rules";
import productRules from "@modules/product/rules/product.rules";

export default fp(async (fastify: FastifyInstance) => {
  const rules: Rule[] = [...authRules, ...userRules, ...productRules];

  fastify.addHook("preHandler", async (req, reply) => {
    const url = req.url as string;

    for (const { method, pathRegex, schema } of rules) {
      if (req.method === method && pathRegex.test(req.url)) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          return sendReply(
            reply,
            400,
            ResponseCode.BAD_REQUEST,
            null,
            "Validation error",
            result.error.errors.map((e) => e.message),
          );
        }
        req.body = result.data;
        break;
      }
    }
  });
});
