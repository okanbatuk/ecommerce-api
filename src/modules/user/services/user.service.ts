import { Prisma } from "@prisma/client";
import { User } from "../user.entity";
import { UserDto } from "../dtos/user.dto";
import { UserMapper } from "../mappers/user.mapper";
import { CreateUserInput, UpdateUserInput } from "../schemas";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toDto = (u: User | null) => (u ? UserMapper.toDto(u) : undefined);

  async getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[] | undefined> {
    const users = await this.userRepository.findAll({ limit, offset });
    return users.map(this.toDto);
  }

  async getUser(where: Prisma.UserWhereInput): Promise<UserDto | undefined> {
    const user = await this.userRepository.findOne(where);
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
