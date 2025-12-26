import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from "fastify";
import fp from "fastify-plugin";
import { logger } from "@/config";
import { RES_MSG, Role } from "../constants";
import { ForbiddenError, UnauthorizedError } from "../exceptions";
import type { JwtPayload } from "@/modules/auth/types/jwt/jwt-payload.type";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = await req.jwtVerify<JwtPayload>();

        // Check Token Version
        const tokenVersion = await fastify.userRepo.getTokenVersion(
          payload.userId,
        );
        if (payload.ver !== tokenVersion) {
          logger.warn(
            `[Auth.authenticate] Token revoked. Expected=${tokenVersion} Received=${payload.ver}`,
          );
          throw new UnauthorizedError(RES_MSG.REVOKED("Token"));
        }

        // Compare deviceId
        const exists = await fastify.redis.exists(
          `refresh:${payload.userId}:${payload.deviceId}`,
        );
        if (!exists) {
          logger.warn(
            `[Auth.authenticate] Device revoked. userId=${payload.userId} deviceId=${payload.deviceId}`,
          );
          throw new UnauthorizedError(RES_MSG.REVOKED("Device"));
        }
      } catch (err) {
        if (err instanceof UnauthorizedError) throw err;
        logger.warn("[Auth.authenticate] JWT verification failed");
        throw new UnauthorizedError("Unauthorized Error!!");
      }
    },
  );

  fastify.decorate("optionalAuth", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify<JwtPayload>();
    } catch (err) {}
  });

  fastify.decorate(
    "assertOwnUser",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      if (req.user.userId !== req.params.id) {
        logger.warn(
          `[Auth.assertOwnUser] Access denied. userId=${req.user.userId} paramId=${req.params.id}`,
        );
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
      if (req.user.role !== Role.ADMIN) {
        logger.warn(
          `[Auth.assertAdmin] Admin required. username=${req.user.username} role=${req.user.role}`,
        );
        throw new ForbiddenError("Admin required");
      }
    },
  );

  fastify.decorate(
    "assertAdminOrSelf",
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      if (req.user.role === Role.ADMIN) return;
      if (req.user.userId !== req.params.id) {
        logger.warn(
          `[Auth.assertAdminOrSelf] Access denied. userId=${req.user.userId}  paramId=${req.params.id}`,
        );
        throw new ForbiddenError();
      }
    },
  );
});
