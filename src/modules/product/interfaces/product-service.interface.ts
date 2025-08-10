import { ProductFilter } from "../domain";
import { ICreatable, IService } from "@/shared";
import { ProductDto } from "../dtos/product.dto";
import { CreateProductInput, SlugParam, UpdateProductInput } from "../schemas";

export interface IProductService
  extends IService<ProductDto, UpdateProductInput, ProductFilter>,
    ICreatable<ProductDto, CreateProductInput> {
  getBySlug(slug: string): Promise<ProductDto>;
  update(id: string, rawData: UpdateProductInput): Promise<ProductDto>;
}
