import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { ForbiddenError, UnauthorizedError } from "../exceptions";
import { Role } from "../constants";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("authenticate", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      throw new UnauthorizedError("Unauthorized Error!!");
    }
  });

  fastify.decorate(
    "assertOwnUser",
    async (req: FastifyRequest<{ Params: { id: string } }>) => {
      if (req.user.userId !== req.params.id) {
        throw new ForbiddenError();
      }
    },
  );

  fastify.decorate(
    "assertAdmin",
    async (req: FastifyRequest): Promise<void> => {
      if (req.user.role !== Role.ADMIN)
        throw new ForbiddenError("Admin required");
    },
  );
});
