import { Prisma } from "@prisma/client";
import { UserDto } from "../dtos/user.dto";
import { CreateUserInput, UpdateUserInput } from "../schemas";

export interface IUserService {
  getAllUsers({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<UserDto[] | undefined>;
  getUser(where: Prisma.UserWhereInput): Promise<UserDto>;
  createUser(data: CreateUserInput): Promise<UserDto>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;
}
