import type {
  CreateUserInput,
  UpdateUserInput,
  UserSearchQueryType,
} from "../schemas";
import type { IRepository } from "@/shared";
import type { User, UserFilter } from "../domain";

export interface IUserRepository
  extends IRepository<User, CreateUserInput, UpdateUserInput, UserFilter> {
  getTokenVersion(id: string): Promise<number | null>;
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  incrementTokenVersion(id: string): Promise<void>;
  updatePassword(id: string, password: string): Promise<void>;
}
