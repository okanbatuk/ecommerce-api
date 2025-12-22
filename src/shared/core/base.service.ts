export abstract class BaseService<TDto, TEntity> {
  protected abstract toDto(entity: TEntity): TDto;

  protected mapOne(entity: TEntity): TDto {
    return this.toDto(entity);
  }

  protected mapMany(entities: TEntity[]): TDto[] {
    return entities.map(this.toDto);
  }
}
