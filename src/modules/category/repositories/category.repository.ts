import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";
import { BaseRepository, TYPES } from "@/shared";
import { CategoryMapper } from "../mappers/category.mapper";
import { prismaCategoryFilter } from "../filters/prisma-category.filter";

import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { ICategoryRepository } from "../interfaces";
import type { CreateCategoryData, UpdateCategoryData } from "../schemas";

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

  async findMany(
    filter: CategoryFilter = {},
    pagination?: { limit: number; offset: number },
  ): Promise<Category[]> {
    const rows = await this.category.findMany({
      where: prismaCategoryFilter(filter),
      skip: pagination?.offset,
      take: pagination?.limit,
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
