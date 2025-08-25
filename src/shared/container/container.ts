import { Container } from "inversify";
import { PrismaClient } from "@prisma/client";

import { TYPES } from "../types";
import { prisma } from "../lib";
import { config } from "@/config";

import type { JwtConfig } from "@/modules/auth/types/jwt/jwt-config.type";
import type { IJwtService } from "@/modules/auth/interfaces/jwt-service.interface";
import { JwtService } from "@/modules/auth/services/jwt.service";

// import Repositories && Repo Interfaces
import { UserRepository } from "@/modules/user/repositories/user.repository";
import { ProductRepository } from "@/modules/product/repositories/product.repository";
import { CategoryRepository } from "@/modules/category/repositories/category.repository";

import type { IUserRepository, IUserService } from "@/modules/user/interfaces";
import type {
  IProductRepository,
  IProductService,
} from "@/modules/product/interfaces";
import type {
  ICategoryRepository,
  ICategoryService,
} from "@/modules/category/interfaces";

// import Services && Service Interfaces
import { AuthService } from "@/modules/auth/services/auth.service";
import { UserService } from "@/modules/user/services/user.service";
import { CategoryService } from "@/modules/category/services/category.service";
import { ProductService } from "@/modules/product/services/product.service";
import type { IAuthService } from "@/modules/auth/interfaces/auth-service.interface";

// import Controllers
import { AuthController } from "@/modules/auth/controllers/auth.controller";
import { UserController } from "@/modules/user/controllers/user.controller";
import { ProductController } from "@/modules/product/controllers/product.controller";
import { CategoryController } from "@/modules/category/controllers/category.controller";

export const container = new Container();

const jwtConfig = {
  accessSecret: config.jwt.accessSecret,
  refreshSecret: config.jwt.refreshSecret,
  accessExpiresIn: config.jwt.accessExpiresIn,
  refreshExpiresIn: config.jwt.refreshExpiresIn,
  issuer: "ecommerce-api",
  audience: "ecommerce-users",
};

// Bind Global deps
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

// Bind shared deps
container.bind<IJwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container.bind<JwtConfig>(TYPES.JwtConfig).toConstantValue(jwtConfig);

// Bind Repositories deps
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IProductRepository>(TYPES.ProductRepository)
  .to(ProductRepository)
  .inSingletonScope();
container
  .bind<ICategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepository)
  .inSingletonScope();

// Bind Services
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<IUserService>(TYPES.UserService)
  .to(UserService)
  .inSingletonScope();
container
  .bind<IProductService>(TYPES.ProductService)
  .to(ProductService)
  .inSingletonScope();
container
  .bind<ICategoryService>(TYPES.CategoryService)
  .to(CategoryService)
  .inSingletonScope();

// Bind Controllers
container
  .bind<AuthController>(TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();
container
  .bind<UserController>(TYPES.UserController)
  .to(UserController)
  .inSingletonScope();
container
  .bind<ProductController>(TYPES.ProductController)
  .to(ProductController)
  .inSingletonScope();
container
  .bind<CategoryController>(TYPES.CategoryController)
  .to(CategoryController)
  .inSingletonScope();
