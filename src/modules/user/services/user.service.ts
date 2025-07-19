import { Prisma } from "@prisma/client";
import { User } from "../user.entity";
import { UserDto } from "../dtos/user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { CreateUserInput, UpdateUserInput } from "../schemas";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { NotFoundError } from "../../../shared/exceptions";

const MSG = {
  NOT_FOUND: "User not found",
  NO_USERS: "No users found",
} as const;

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toDto = (u: User) => UserMapper.toDto(u);

  async getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[]> {
    const users = await this.userRepository.findAll({ limit, offset });
    if (users.length === 0) throw new NotFoundError(MSG.NO_USERS);
    return users.map(this.toDto);
  }

  async getUser(where: Prisma.UserWhereInput): Promise<UserDto> {
    const user = await this.userRepository.findOne(where);
    if (!user) throw new NotFoundError(MSG.NOT_FOUND);
    return this.toDto(user);
  }

  async createUser(data: CreateUserInput): Promise<UserDto> {
    const user = await this.userRepository.create(data);
    return this.toDto(user);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDto> {
    const user = await this.userRepository.update(id, data);
    return this.toDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
