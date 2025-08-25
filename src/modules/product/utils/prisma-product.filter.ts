import { Prisma } from "@prisma/client";
import { ProductFilter } from "../domain/product.filter";
import { caseInsensitive } from "@/shared/lib";

export const prismaProductFilter = (
  f: ProductFilter,
): Prisma.ProductWhereInput => ({
  ...(f.name && { name: caseInsensitive(f.name) }),
  ...(f.minPrice !== undefined && { price: { gte: f.minPrice } }),
  ...(f.maxPrice !== undefined && { price: { lte: f.maxPrice } }),
  ...(f.inStock !== undefined && {
    stock: f.inStock ? { gt: 0 } : { equals: 0 },
  }),
});
