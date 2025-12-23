import {
  BadRequestError,
  ConflictError,
  FindOptions,
  NotFoundError,
  RES_MSG,
  TYPES,
} from "@/shared";
import { BaseService } from "@/shared/core";
import { inject, injectable } from "inversify";
import { CategoryMapper } from "./mapper";
import { buildCategorySlug, normalizeUpdateFields } from "./utils";
import { normalizeAddFields } from "./utils/add-fields.normalize";

import type { CategoryDto } from "./dtos/category.dto";
import type { Category } from "./entity";
import type { CategoryQuery } from "./filters";
import type { ICategoryRepository } from "./interfaces/repository";
import type { ICategoryService } from "./interfaces/service";
import type { AddCategoryInput } from "./schemas/add-input";
import type { UpdateCategoryData } from "./schemas/update-data";
import type { UpdateCategoryInput } from "./schemas/update-input";

@injectable()
export class CategoryService
  extends BaseService<CategoryDto, Category>
  implements ICategoryService
{
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super();
  }
  protected toDto(entity: Category): CategoryDto {
    return CategoryMapper.toDto(entity);
  }

  private async getCategory(id: number, opt?: FindOptions): Promise<Category> {
    const category = await this.categoryRepository.findById(id, opt);
    if (!category) throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));
    return category;
  }

  private async isSlugUnique(slug: string) {
    const exists = await this.categoryRepository.findBySlug(slug);
    if (exists) throw new ConflictError(RES_MSG.DUPLICATE("Category slug"));
  }

  private ensureVisible(
    entity: Category | null,
    opt?: { includeDeleted?: boolean },
  ): asserts entity is Category {
    if (!entity) throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));
    if (!opt?.includeDeleted && entity.isDeleted)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));
  }

  async findMany(query: CategoryQuery = {}): Promise<CategoryDto[]> {
    const { search, options, ...filter } = query;

    if (search && (filter.name || filter.slug)) {
      throw new BadRequestError(
        "search cannot be used together with name or slug filters",
      );
    }

    const rows = await this.categoryRepository.findMany(filter, {
      search,
      includeDeleted: options?.includeDeleted,
    });

    if (!rows.length) throw new NotFoundError(RES_MSG.NOT_FOUND("Categories"));

    return this.mapMany(rows);
  }

  async findById(id: number, opt?: FindOptions): Promise<CategoryDto> {
    const row = await this.categoryRepository.findById(id, opt);

    this.ensureVisible(row, opt);

    return this.mapOne(row);
  }

  async findBySlug(slug: string, opt?: FindOptions): Promise<CategoryDto> {
    const row = await this.categoryRepository.findBySlug(slug, opt);

    this.ensureVisible(row, opt);

    return this.mapOne(row);
  }

  async findRoots(opt?: FindOptions): Promise<CategoryDto[]> {
    const rows = await this.categoryRepository.findRoots(opt);
    if (!rows.length)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Root Categories"));

    rows.forEach((r) => this.ensureVisible(r, opt));

    return this.mapMany(rows);
  }

  async findChildren(id: number, opt?: FindOptions): Promise<CategoryDto[]> {
    const rows = await this.categoryRepository.findChildren(id, opt);
    if (!rows.length)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Children Categories"));

    rows.forEach((r) => this.ensureVisible(r, opt));

    return this.mapMany(rows);
  }

  async create(input: AddCategoryInput): Promise<CategoryDto> {
    const refinedData: AddCategoryInput = normalizeAddFields(input);
    let parentSlug: string | undefined;
    if (refinedData.parentId) {
      const parent = await this.categoryRepository.findById(
        refinedData.parentId,
      );
      if (!parent)
        throw new NotFoundError(RES_MSG.NOT_FOUND("Parent Category"));

      parentSlug = parent.slug;
    }

    const slug = buildCategorySlug(refinedData.name, parentSlug);

    await this.isSlugUnique(slug);

    const addedCategory = await this.categoryRepository.create({
      ...refinedData,
      slug,
    });
    return this.toDto(addedCategory);
  }

  async update(id: number, data: UpdateCategoryInput): Promise<CategoryDto> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));

    const refinedData: UpdateCategoryInput = normalizeUpdateFields(data);

    if (refinedData.parentId === id)
      throw new ConflictError("Cannot set category as its own parent");

    const updateData: UpdateCategoryData = { ...refinedData };
    if (refinedData.name !== undefined || refinedData.parentId !== undefined) {
      let parentSlug: string | undefined;
      const parentId = refinedData.parentId ?? category.parentId;
      if (parentId) {
        const parent = await this.categoryRepository.findById(parentId);
        if (!parent)
          throw new NotFoundError(RES_MSG.NOT_FOUND("Parent Category"));

        parentSlug = parent.slug;
      }

      const slug = buildCategorySlug(
        refinedData.name ?? category.name,
        parentSlug,
      );
      if (slug) updateData.slug = slug;
      await this.isSlugUnique(slug);
    }
    const updated = await this.categoryRepository.update(id, updateData);

    return this.mapOne(updated);
  }

  async delete(id: number): Promise<void> {
    await this.getCategory(id, { includeDeleted: true });
    await this.categoryRepository.delete(id);
  }

  async restore(id: number): Promise<CategoryDto> {
    const category = await this.getCategory(id, { includeDeleted: true });
    if (!category.isDeleted) return this.mapOne(category);
    const restored = await this.categoryRepository.restore(id);
    return this.mapOne(restored);
  }

  async deletePermanently(id: number): Promise<void> {
    await this.getCategory(id, { includeDeleted: true });
    await this.categoryRepository.deletePermanently(id);
  }
}
