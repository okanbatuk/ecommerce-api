import { Product } from "../domain/product.entity";
import { ProductDto } from "../dtos/product.dto";

export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
