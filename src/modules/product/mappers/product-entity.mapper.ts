import { Product as PrismaProduct } from "@prisma/client";
import { Product } from "../domain/product.entity";

export const toDomainProduct = (p: PrismaProduct): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  description: p.description ?? undefined,
  price: p.price.toNumber(),
  stock: p.stock,
  images: p.images ?? [],
  isActive: p.isActive,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});
