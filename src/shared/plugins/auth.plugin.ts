import {
  FastifyInstance,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import fp from "fastify-plugin";
import { Role } from "../constants";
import { FastifyReply } from "fastify/types/reply";
import { ForbiddenError, UnauthorizedError } from "../exceptions";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (err) {
        throw new UnauthorizedError("Unauthorized Error!!");
      }
    },
  );

  fastify.decorate(
    "assertOwnUser",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      if (req.user.userId !== req.params.id) {
        throw new ForbiddenError();
      }
    },
  );

  fastify.decorate(
    "assertAdmin",
    async <T extends RouteGenericInterface = RouteGenericInterface>(
      req: FastifyRequest<T>,
      reply: FastifyReply,
    ) => {
      if (req.user.role !== Role.ADMIN)
        throw new ForbiddenError("Admin required");
    },
  );

  fastify.decorate(
    "assertAdminOrSelf",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      if (req.user.role === Role.ADMIN) return;
      if (req.user.userId !== req.params.id) throw new ForbiddenError();
    },
  );
});
