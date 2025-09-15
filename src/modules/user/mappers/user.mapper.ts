import { IMapper } from "@/shared";
import { User as PrismaUser } from "@prisma/client";
import { UserDto } from "../dtos/user.dto";
import { User } from "../domain";

export const UserMapper: IMapper<PrismaUser, UserDto, User> = class {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      role: user.role,
    };
  }

  static toDomainEntity = (p: PrismaUser): User => ({
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
};
