import { RES_MSG } from "../constants";
import { NotFoundError } from "../exceptions";

import type { Pagination } from "../types";
import type { IService } from "@shared/interfaces/service.interface";
import type { IRepository } from "@shared/interfaces/repository.interface";

export abstract class BaseService<
  T, // DTO
  E, // Entity
  C = Partial<T>, // Create Dto
  U = Partial<T>, // Update DTO
  F = Partial<T>, // Filter
  R extends IRepository<E, C, U, F> = IRepository<E, C, U, F>,
> implements IService<T, U, F>
{
  constructor(protected readonly repository: R) {}

  protected abstract toDto(entity: E): T;

  async findAll({ limit, offset }: Pagination): Promise<T[]> {
    const rows = await this.repository.findAll({ limit, offset });
    if (rows.length === 0)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Records"));
    return rows.map(this.toDto);
  }

  async findMany(filter: F, pagination?: Pagination): Promise<T[]> {
    const rows = await this.repository.findMany(filter, pagination);

    if (rows.length === 0)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Records"));

    return rows.map(this.toDto);
  }

  async findOne(filter: F): Promise<T> {
    const row = await this.repository.findOne(filter);
    if (!row) throw new NotFoundError(RES_MSG.NOT_FOUND("Record"));
    return this.toDto(row);
  }

  async update(id: string, refinedData: U): Promise<T> {
    const row = await this.repository.update(id, refinedData);
    return this.toDto(row);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
