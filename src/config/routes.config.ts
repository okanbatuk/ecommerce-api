import { FastifyInstance } from "fastify";
import authRoutes from "@/modules/auth/auth.routes";
import userRoutes from "@/modules/user/user.routes";
import productRoutes from "@/modules/product/product.routes";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(
    async (api) => {
      await app.register(authRoutes, { prefix: "/auth" });
      await app.register(userRoutes, { prefix: "/users" });
      await app.register(productRoutes, { prefix: "/products" });
    },
    {
      prefix: "/api/v1",
    },
  );
}
