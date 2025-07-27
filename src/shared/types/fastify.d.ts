import "@fastify/jwt";
import { JwtPayload } from "@/modules/auth/types/jwt";

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
    authenticate: (req: FastifyRequest) => Promise<void>;
    assertOwnUser: (
      req: FastifyRequest<{ Params: { id: string } }>,
    ) => Promise<void>;
    assertAdmin: (req: FastifyRequest) => Promise<void>;
  }
}
