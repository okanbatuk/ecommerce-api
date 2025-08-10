// modules/product/factories/product-service.factory.ts
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";

export class ProductServiceFactory {
  private static instance: ProductService | null = null;

  static getInstance(): ProductService {
    if (!this.instance) {
      const productRepository = new ProductRepository();
      this.instance = new ProductService(productRepository);
    }
    return this.instance;
  }
}
