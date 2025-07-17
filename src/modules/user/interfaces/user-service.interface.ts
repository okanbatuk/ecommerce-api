import { UserDto } from "../dtos";
import { CreateUserInput, UpdateUserInput } from "../schemas";

export interface IUserService {
  createUser(data: CreateUserInput): Promise<UserDto>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserDto>;
  getUserById(id: string): Promise<UserDto | null>;
  getUserByUsername(username: string): Promise<UserDto | null>;
  getUserByEmail(email: string): Promise<UserDto | null>;
  deleteUser(id: string): Promise<void>;
}
