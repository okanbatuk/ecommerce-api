import "@fastify/jwt";
import { JwtPayload } from "@/modules/auth/types/jwt";
import { RouteGenericInterface } from "fastify";
import { UserRepository } from "@/modules/user/repositories/user.repository";
import Redis from "ioredis";

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
