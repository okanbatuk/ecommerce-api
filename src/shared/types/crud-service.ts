import type {
  ICreatable,
  IDeletable,
  IReadable,
  IRestorable,
  IUpdatable,
} from "../interfaces";

export type CrudService<TQuery, TCreate, TUpdate, TDto> = IReadable<
  TQuery,
  TDto
> &
  ICreatable<TCreate, TDto> &
  IUpdatable<TUpdate, TDto> &
  IRestorable<TDto> &
  IDeletable;
