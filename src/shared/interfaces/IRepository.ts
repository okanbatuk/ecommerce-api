import { CreateUserDto, UpdateUserDto } from "../../modules/user/dtos";

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: CreateUserDto): Promise<T>;
  update(id: string, data: UpdateUserDto): Promise<T>;
  delete(id: string): Promise<void>;
}
