import { inject, injectable } from "inversify";
import {
  generateSlug,
  normalizeAddFields,
  normalizeUpdateFields,
} from "../utils";
import { ProductMapper } from "../mappers";
import { BaseService } from "@/shared/services/base.service";
import { ConflictError, NotFoundError, RES_MSG, TYPES } from "@/shared";

import type {
  AddProductInput,
  CreateProductInput,
  UpdateProductInput,
} from "../schemas";
import type { ProductDto } from "../dtos/product.dto";
import type { Product, ProductFilter } from "../domain";
import type { IProductRepository, IProductService } from "../interfaces";

@injectable()
export class ProductService
  extends BaseService<
    ProductDto,
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductFilter,
    IProductRepository
  >
  implements IProductService
{
  constructor(
    @inject(TYPES.ProductRepository)
    private readonly productRepository: IProductRepository,
  ) {
    super(productRepository);
  }

  protected toDto(entity: Product): ProductDto {
    return ProductMapper.toDto(entity);
  }

  async getBySlug(slug: string): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ slug });
    if (!product) throw new NotFoundError(RES_MSG.NOT_FOUND("Product"));
    return this.toDto(product);
  }

  async create(rawData: AddProductInput): Promise<ProductDto> {
    const refinedData: AddProductInput = normalizeAddFields(rawData);

    let slug: string = "";
    do {
      slug = generateSlug(refinedData.name);
    } while (await this.productRepository.findOne({ slug }));

    const addedProduct = await this.productRepository.create({
      ...refinedData,
      slug,
    });
    return this.toDto(addedProduct);
  }

  override async update(
    id: string,
    rawData: UpdateProductInput,
  ): Promise<ProductDto> {
    const refinedData: UpdateProductInput = normalizeUpdateFields(rawData);

    const existProduct = await this.productRepository.findOne({ id });
    if (!existProduct) throw new NotFoundError(RES_MSG.NOT_FOUND("Product"));

    if (
      refinedData.slug &&
      (await this.productRepository.findOne({
        slug: refinedData.slug,
      }))
    )
      throw new ConflictError(RES_MSG.DUPLICATE("Slug"));

    const updatedProduct = await this.productRepository.update(id, refinedData);
    return this.toDto(updatedProduct);
  }

  async restore(id: string): Promise<ProductDto> {
    const restored = await this.productRepository.restore(id);
    return this.toDto(restored);
  }
}
