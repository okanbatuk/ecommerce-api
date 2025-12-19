/** @deprecated this interface is not used anymore */
/**
 * P = Prisma raw type
 * D = DTO type  (returns to client)
 * E = Domain entity type (for app)
 */
export interface IMapper<P, D, E> {
  toDto(entity: E): D;
  toDomainEntity(prismaEntity: P): E;
  toDomainEntities?(pEntities: P[]): E[];
}
