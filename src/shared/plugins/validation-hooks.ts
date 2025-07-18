import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Rule } from "../types/validation-rule";
import { sendReply } from "../utils/send-response";
import { ResponseCode } from "../types/response-code";
import { createUserSchema, updateUserSchema } from "../../modules/user/schemas";

export default fp(async (fastify: FastifyInstance) => {
  const rules: Rule[] = [
    {
      method: "PATCH",
      pathPrefix: "/users",
      schema: updateUserSchema,
    },
    {
      method: "POST",
      pathPrefix: "/users",
      schema: createUserSchema,
    },
  ];

  fastify.addHook("preValidation", async (req, reply) => {
    const url = req.url as string;

    for (const { method, pathPrefix, schema } of rules) {
      if (req.method === method && url.startsWith(pathPrefix)) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          return sendReply(
            reply,
            400,
            ResponseCode.BAD_REQUEST,
            null,
            "Validation error",
            result.error.errors.map((e) => e.message)
          );
        }
        req.body = result.data;
        break;
      }
    }
  });
});
