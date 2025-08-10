import { FastifyInstance } from "fastify";

export function disablePlugins(app: FastifyInstance) {
  app.setValidatorCompiler(() => {
    return (data) => {
      return { value: data };
    };
  });
}
