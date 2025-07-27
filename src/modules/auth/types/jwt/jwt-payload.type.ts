import { Role } from "@/shared";

export type JwtPayload = {
  userId: string;
  email: string;
  username: string;
  role: Role;
  jti?: string;
  iat?: number;
  exp?: number;
};
