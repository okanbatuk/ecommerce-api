export abstract class BaseService<TDto, TEntity> {
  protected abstract toDto(entity: TEntity): TDto;
}
