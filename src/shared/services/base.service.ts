// shared/services/base.service.ts
import { IService } from "@shared/interfaces/service.interface";
import { IRepository } from "@shared/interfaces/repository.interface";
import { ICreatable } from "../interfaces/creatable.interface";
import { NotFoundError } from "../exceptions";

export abstract class BaseService<
  T, // DTO
  E, // Entity
  C = Partial<T>,
  U = Partial<T>, // Update DTO
  F = Partial<T>, // Filter
> implements IService<T, U, F>
{
  constructor(protected readonly repository: IRepository<E, C, U, F>) {}

  protected abstract toDto(entity: E): T;

  async findAll({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<T[]> {
    const rows = await this.repository.findAll({ limit, offset });
    if (rows.length === 0) throw new NotFoundError("No records found");
    return rows.map(this.toDto);
  }

  async findOne(filter: F): Promise<T> {
    const row = await this.repository.findOne(filter);
    if (!row) throw new NotFoundError("Record not found!");
    return this.toDto(row);
  }

  async update(id: string, data: U): Promise<T> {
    const row = await this.repository.update(id, data);
    return this.toDto(row);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
