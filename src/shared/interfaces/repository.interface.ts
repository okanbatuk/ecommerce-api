import { Prisma } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "@modules/user/schemas";

export interface IRepository<T> {
  findAll({ limit, offset }: { limit: number; offset: number }): Promise<T[]>;
  findOne(where: Prisma.UserWhereInput): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: CreateUserInput): Promise<T>;
  update(id: string, data: UpdateUserInput): Promise<T>;
  delete(id: string): Promise<void>;
}
