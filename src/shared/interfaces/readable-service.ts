import type { FindOptions } from "../types";

export interface IReadable<TQuery, TDto> {
  findById(id: number, opt?: FindOptions): Promise<TDto>;
  findMany(query?: TQuery): Promise<TDto[]>;
}
