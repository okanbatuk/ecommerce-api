import { UserDto } from "../dtos/user.dto";
import { UserFilter } from "../domain/user-filter";
import { UpdatePasswordInput, UpdateUserInput } from "../schemas";

export interface IUserService {
  getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[] | undefined>;
  getUser(filter: UserFilter): Promise<UserDto>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserDto>;
  updatePassword(id: string, data: UpdatePasswordInput): Promise<void>;
  deleteUser(id: string): Promise<void>;
}
