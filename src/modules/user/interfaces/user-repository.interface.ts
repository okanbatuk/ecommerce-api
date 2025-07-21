import { User } from "../user.entity";
import { IRepository } from "@shared/interfaces/repository.interface";

export interface IUserRepository extends IRepository<User> {
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
