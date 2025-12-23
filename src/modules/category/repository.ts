import { TYPES } from "@/shared";
import { BaseRepository } from "@/shared/core";
import { Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { prismaCategoryFilter } from "./filters/prisma.filter";
import { CategoryMapper } from "./mapper";

import type { FindManyOptions, FindOptions } from "@/shared";
import type { Category } from "./entity";
import type { CategoryFilter } from "./filters";
import type { ICategoryRepository } from "./interfaces/repository";
import type { CreateCategoryData } from "./schemas/create-data";
import type { UpdateCategoryData } from "./schemas/update-data";

@injectable()
export class CategoryRepository
  extends BaseRepository
  implements ICategoryRepository
{
  protected toDomain = CategoryMapper.toDomainEntity;
  private readonly category = this.prisma.category;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  private applyVisibility(
    where: Prisma.CategoryWhereInput,
    options?: FindOptions,
  ) {
    if (options?.includeDeleted) return where;

    return {
      ...where,
      isDeleted: false,
    };
  }

  async findById(id: number, options?: FindOptions): Promise<Category | null> {
    const row = await this.category.findFirst({
      where: this.applyVisibility({ id }, options),
      include: { products: true },
    });
    if (!row) return null;

    return this.toDomain(row);
  }

  async findBySlug(
    slug: string,
    options?: FindOptions,
  ): Promise<Category | null> {
    const row = await this.category.findFirst({
      where: this.applyVisibility({ slug }, options),
      include: { products: true },
    });
    if (!row) return null;

    return this.toDomain(row);
  }

  async findRoots(options?: FindOptions): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: this.applyVisibility({ parentId: null }, options),
      orderBy: { name: "asc" },
    });

    return rows.map(this.toDomain);
  }

  async findChildren(
    parentId: number,
    options?: FindOptions,
  ): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: this.applyVisibility({ parentId }, options),
      orderBy: { name: "asc" },
    });

    return rows.map(this.toDomain);
  }

  async findMany(
    filter: CategoryFilter = {},
    options?: FindManyOptions,
  ): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: this.applyVisibility(
        prismaCategoryFilter(filter, options?.search),
        options,
      ),
      orderBy: { createdAt: "desc" },
    });

    return rows.map(this.toDomain);
  }

  async create(data: CreateCategoryData): Promise<Category> {
    const row = await this.category.create({ data });
    return this.toDomain(row);
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    const row = await this.category.update({
      where: { id },
      data,
    });
    return this.toDomain(row);
  }

  async delete(id: number): Promise<void> {
    await this.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async restore(id: number): Promise<Category> {
    return await this.category.update({
      where: { id },
      data: { isDeleted: false },
    });
  }

  async deletePermanently(id: number): Promise<void> {
    await this.category.delete({ where: { id } });
  }
}
