import { inject, injectable } from "inversify";
import { ConflictError, NotFoundError, RES_MSG, TYPES } from "@/shared";
import { BaseService } from "@/shared/services/base.service";
import { CategoryMapper } from "../mappers";
import { buildCategorySlug, normalizeUpdateFields } from "../utils";
import { normalizeAddFields } from "../utils/add-fields.normalize";

import type { CategoryDto } from "../dtos/category.dto";
import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { ICategoryRepository } from "../interfaces";
import type { ICategoryService } from "../interfaces/category-service.interface";
import type {
  AddCategoryInput,
  UpdateCategoryData,
  UpdateCategoryInput,
} from "../schemas";

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
  async findMany(
    filter: CategoryFilter = {},
    options?: { includeDeleted?: boolean },
  ): Promise<CategoryDto[]> {
    const refinedFilter: CategoryFilter = {
      ...filter,
      ...(options?.includeDeleted ? {} : { isDeleted: false }),
    };

    const rows = await this.categoryRepository.findMany(refinedFilter);

    if (rows.length === 0)
      throw new NotFoundError(RES_MSG.NOT_FOUND("Categories"));

    return rows.map(this.toDto);
  }

  async findById(id: number): Promise<CategoryDto> {
    const row = await this.categoryRepository.findById(id);

    if (!row) throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));

    return this.toDto(row);
  }

  async findBySlug(slug: string): Promise<CategoryDto> {
    const row = await this.categoryRepository.findBySlug(slug);

    if (!row) throw new NotFoundError(RES_MSG.NOT_FOUND("Category"));

    return this.toDto(row);
  }

  async create(data: AddCategoryInput): Promise<CategoryDto> {
    const refinedData: AddCategoryInput = normalizeAddFields(data);
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

    const exists = await this.categoryRepository.findBySlug(slug);
    if (exists) throw new ConflictError(RES_MSG.DUPLICATE("Category slug"));

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

      const exists = await this.categoryRepository.findBySlug(slug);
      if (exists && exists.id !== id)
        throw new ConflictError(RES_MSG.DUPLICATE("Category slug"));
    }
    const updated = await this.categoryRepository.update(id, updateData);

    return this.toDto(updated);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  async restore(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.restore(id);
    return this.toDto(category);
  }

  async deletePermanently(id: number): Promise<void> {
    await this.categoryRepository.deletePermanently(id);
  }
}
