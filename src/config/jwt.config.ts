import { config } from "./env.config";
import type { JwtConfig } from "@modules/auth/types/jwt/jwt-config.type";

export const jwtConfig: JwtConfig = {
  accessSecret: config.jwt.accessSecret,
  refreshSecret: config.jwt.refreshSecret,
  accessExpiresIn: config.jwt.accessExpiresIn,
  refreshExpiresIn: config.jwt.refreshExpiresIn,
  issuer: "ecommerce-api",
  audience: "ecommerce-users",
};
