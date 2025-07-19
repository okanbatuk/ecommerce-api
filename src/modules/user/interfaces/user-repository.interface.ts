import { User } from "../user.entity";
import { IRepository } from "../../../shared/interfaces/repository.interface";

export interface IUserRepository extends IRepository<User> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailOrUsername(identifier: string): Promise<User | null>;
}
