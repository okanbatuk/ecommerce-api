export interface FindOptions {
  includeDeleted?: boolean;
}

export interface FindManyOptions extends FindOptions {
  search?: string;
}
