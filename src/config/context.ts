import { UserRepository } from "@/modules/user/repositories/user.repository";
import { TYPES } from "@/shared";
import { container } from "@/shared/container/container";
import { redis } from "@/shared/lib";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(async (app: FastifyInstance) => {
  const userRepo = container.get<UserRepository>(TYPES.UserRepository);
  app.decorate("userRepo", userRepo);
  app.decorate("redis", redis);
});
