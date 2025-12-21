import { TYPES } from "@/shared";
import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { prismaCategoryFilter } from "../filters/prisma-category.filter";
import { CategoryMapper } from "../mappers/category.mapper";
import { BaseRepository } from "@/shared/repositories/base.repository";

import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { ICategoryRepository } from "../interfaces/category-repository.interface";
import type { CreateCategoryData } from "../schemas/create-data.schema";
import type { UpdateCategoryData } from "../schemas/update-data.schema";

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

  async findById(id: number): Promise<Category | null> {
    const row = await this.category.findUnique({
      where: { id },
      include: { products: true },
    });
    if (!row) return null;

    return this.toDomain(row);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await this.category.findUnique({
      where: { slug },
      include: { products: true },
    });
    if (!row) return null;

    return this.toDomain(row);
  }

  async findRoots(): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    });

    return rows.map(this.toDomain);
  }

  async findChildren(parentId: number): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: { parentId },
      orderBy: { name: "asc" },
    });

    return rows.map(this.toDomain);
  }

  async findMany(filter: CategoryFilter = {}): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: prismaCategoryFilter(filter),
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
