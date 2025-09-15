/**
 * P = Prisma raw type
 * D = DTO type  (client'a dönülen)
 * E = Domain entity type (uygulama içi)
 */
export interface IMapper<P, D, E> {
  toDto(entity: E): D;
  toDomainEntity(prismaEntity: P): E;
}
