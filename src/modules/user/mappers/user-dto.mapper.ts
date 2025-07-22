import { User } from "../domain/user.entity";
import { UserDto } from "../dtos/user.dto";

export class UserMapper {
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
}
