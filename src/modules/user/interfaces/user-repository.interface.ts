import { User } from "../domain/user.entity";
import { CreateUserInput, UpdateUserInput } from "../schemas";
import { IRepository } from "@shared/interfaces/repository.interface";
import { UserFilter } from "../domain/user-filter";

export interface IUserRepository
  extends IRepository<User, CreateUserInput, UpdateUserInput, UserFilter> {
  getTokenVersion(id: string): Promise<number | null>;
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  incrementTokenVersion(id: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
}
