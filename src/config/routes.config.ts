import { FastifyInstance } from "fastify";
import authRoutes from "../modules/auth/routes/auth.routes";
import userRoutes from "../modules/user/routes/user.routes";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(
    async (api) => {
      await app.register(authRoutes, { prefix: "/auth" });
      await app.register(userRoutes, { prefix: "/users" });
    },
    {
      prefix: "/api/v1",
    }
  );
}
