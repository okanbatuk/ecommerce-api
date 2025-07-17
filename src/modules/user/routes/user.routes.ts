import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";

export default async function userRoutes(fastify: FastifyInstance) {
  const ctrl = new UserController();

  fastify.get("/", ctrl.search);
  fastify.get("/:id", ctrl.getById);
  fastify.post("/", ctrl.create);
  fastify.post("/:id", ctrl.update);
  fastify.delete("/:id", ctrl.remove);
}
