import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async (app: FastifyInstance) => {
  app.setValidatorCompiler(() => {
    return (data) => {
      return { value: data };
    };
  });
});
