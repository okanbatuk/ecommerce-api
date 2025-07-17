import { CreateUserDto, UpdateUserDto, UserDto } from "../dtos";
import { IUserService } from "../interfaces/user-service.interface";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { UserMapper } from "../mappers/user.mapper";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  // TODO: Map user to UserDto in the repository methods
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
