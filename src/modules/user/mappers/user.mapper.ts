import { User as PrismaUser } from "@prisma/client";
import { UserDto } from "../dtos/user.dto";

export class UserMapper {
  static toDto(user: PrismaUser): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
