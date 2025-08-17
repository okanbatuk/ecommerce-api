import type { ProductFilter } from "../domain";
import type { ICreatable, IService } from "@/shared";
import type { ProductDto } from "../dtos/product.dto";
import type { AddProductInput, UpdateProductInput } from "../schemas";

export interface IProductService
  extends IService<ProductDto, UpdateProductInput, ProductFilter>,
    ICreatable<ProductDto, AddProductInput> {
  getBySlug(slug: string): Promise<ProductDto>;
  update(id: string, rawData: UpdateProductInput): Promise<ProductDto>;
  restore(id: string): Promise<ProductDto>;
}
