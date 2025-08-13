import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { redis } from "./redis.config";
import { UserRepository } from "@/modules/user/repositories/user.repository";

export default fp(async (app: FastifyInstance) => {
  app.decorate("userRepo", UserRepository.getInstance());
  app.decorate("redis", redis);
});
