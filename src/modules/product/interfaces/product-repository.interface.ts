import { IRepository } from "@/shared/interfaces/repository.interface";
import { UpdateProductInput } from "../schemas/update-product.schema";
import { ProductFilter } from "../domain/product.filter";
import { Product } from "../domain/product.entity";
import { CreateProductInput } from "../schemas/create-product.schema";

export interface IProductRepository
  extends IRepository<
    Product,
    CreateProductInput,
    UpdateProductInput,
    ProductFilter
  > {}
