import { Role } from "@/shared";

export type JwtPayload = {
  userId: string;
  email: string;
  username: string;
  role: Role;
  deviceId: string;
  ver?: number;
  iat?: number;
  exp?: number;
};
