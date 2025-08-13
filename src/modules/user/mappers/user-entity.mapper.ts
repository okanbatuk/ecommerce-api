import type { User as PrismaUser } from "@prisma/client";
import type { User } from "../domain/user.entity";

export const toDomainUser = (p: PrismaUser): User => ({
  id: p.id,
  username: p.username,
  email: p.email,
  password: p.password,
  firstName: p.firstName ?? undefined,
  lastName: p.lastName ?? undefined,
  role: p.role as "USER" | "ADMIN",
  tokenVersion: p.tokenVersion,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});
