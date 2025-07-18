import { Prisma } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "../../modules/user/dtos";

export interface IRepository<T> {
  findAll({ limit, offset }: { limit: number; offset: number }): Promise<T[]>;
  findOne(where: Prisma.UserWhereInput): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: CreateUserDto): Promise<T>;
  update(id: string, data: UpdateUserDto): Promise<T>;
  delete(id: string): Promise<void>;
}
