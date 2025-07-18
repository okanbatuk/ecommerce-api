import { UserDto } from "../dtos";
import { CreateUserInput, UpdateUserInput } from "../schemas";

export interface IUserService {
  getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[] | null>;
  getUserById(id: string): Promise<UserDto | null>;
  getUserByUsername(username: string): Promise<UserDto | null>;
  getUserByEmail(email: string): Promise<UserDto | null>;
  createUser(data: CreateUserInput): Promise<UserDto>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;
}
