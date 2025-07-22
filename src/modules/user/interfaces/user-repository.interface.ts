import { Prisma } from "@prisma/client";
import { User } from "../domain/user.entity";
import { CreateUserInput, UpdateUserInput } from "../schemas";
import { IRepository } from "@shared/interfaces/repository.interface";

export interface IUserRepository
  extends IRepository<
    User,
    CreateUserInput,
    UpdateUserInput,
    Prisma.UserWhereInput
  > {
  findByEmailOrUsername(identifier: string): Promise<User | null>;
  updatePassword(id: string, password: string): Promise<void>;
}
