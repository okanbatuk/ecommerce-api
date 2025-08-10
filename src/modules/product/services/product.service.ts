import {
  generateSlug,
  normalizeAddFields,
  normalizeUpdateFields,
} from "../utils";
import {
  AddProductInput,
  CreateProductInput,
  SlugParam,
  UpdateProductInput,
} from "../schemas";
import { ProductMapper } from "../mappers";
import { ProductDto } from "../dtos/product.dto";
import { Product, ProductFilter } from "../domain";
import { BaseService } from "@/shared/services/base.service";
import { ConflictError, NotFoundError, RES_MSG } from "@/shared";
import { IProductRepository, IProductService } from "../interfaces";

export class ProductService
  extends BaseService<
    ProductDto,
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductFilter
  >
  implements IProductService
{
  constructor(private readonly productRepository: IProductRepository) {
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
    const slug = generateSlug(refinedData.name);
    const existProduct = await this.productRepository.findOne({ slug });
    if (existProduct) throw new ConflictError(RES_MSG.DUPLICATE("Slug"));
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
}
