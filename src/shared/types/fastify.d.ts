import "@fastify/jwt";
import Redis from "ioredis";
import { UserRepository } from "@/modules/user/repositories/user.repository";

import type { RouteGenericInterface } from "fastify";
import type { JwtPayload } from "@/modules/auth/types/jwt/jwt-payload.type";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: JwtPayload;
  }

  interface FastifyInstance {
    userRepo: UserRepository;
    redis: Redis;
    authenticate: <T extends RouteGenericInterface = RouteGenericInterface>(
      req: FastifyRequest<T>,
      reply: FastifyReply,
    ) => Promise<void>;

    assertOwnUser: <T extends FastifyRequest<{ Params: { id: string } }>>(
      req: T,
      reply: FastifyReply,
    ) => Promise<void>;

    assertAdmin: <T extends FastifyRequest = FastifyRequest>(
      req: T,
      reply: FastifyReply,
    ) => Promise<void>;

    assertAdminOrSelf: <T extends FastifyRequest<{ Params: { id: string } }>>(
      req: T,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
