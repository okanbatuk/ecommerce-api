import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { redis } from "./redis.config";
import { container, TYPES } from "@/shared";
import { UserRepository } from "@/modules/user/repositories/user.repository";

export default fp(async (app: FastifyInstance) => {
  const userRepo = container.get<UserRepository>(TYPES.UserRepository);
  app.decorate("userRepo", userRepo);
  app.decorate("redis", redis);
});
