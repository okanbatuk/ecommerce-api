import { Prisma } from "@prisma/client";
import { UserMapper } from "../mappers/user.mapper";
import { CreateUserDto, UpdateUserDto, UserDto } from "../dtos";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[] | null> {
    const users = await this.userRepository.findAll({ limit, offset });
    return users.map((data) => UserMapper.toDto(data));
  }

  async getUser(where: Prisma.UserWhereInput): Promise<UserDto | null> {
    const user = await this.userRepository.findOne(where);
    return user ? UserMapper.toDto(user) : null;
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? UserMapper.toDto(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserDto | null> {
    const user = await this.userRepository.findByUsername(username);
    return user ? UserMapper.toDto(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? UserMapper.toDto(user) : null;
  }
  async createUser(data: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepository.create(data);
    return UserMapper.toDto(user);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.update(id, data);
    return UserMapper.toDto(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
