import { injectable, inject } from "inversify";
import { TYPES } from "@/shared";
import { BaseService } from "@/shared/services/base.service";

import type { Category } from "../entities";
import type { CategoryFilter } from "../filters";
import type { CategoryDto } from "../dtos/category.dto";
import type { ICategoryRepository } from "../interfaces";
import type {
  AddCategoryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas";
import type { ICategoryService } from "../interfaces/category-service.interface";
import { normalizeAddFields } from "../utils/add-category-fields.normalize";
import { generateSlug } from "@/modules/product/utils";
import { CategoryMapper } from "../mappers/category.mapper";

@injectable()
export class CategoryService
  extends BaseService<
    CategoryDto,
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
    CategoryFilter,
    ICategoryRepository
  >
  implements ICategoryService
{
  constructor(
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {
    super(categoryRepository);
  }
  protected toDto(entity: Category): CategoryDto {
    return CategoryMapper.toDto(entity);
  }
  async create(data: AddCategoryInput): Promise<CategoryDto> {
    const refinedData: AddCategoryInput = normalizeAddFields(data);

    let slug = "";
    do {
      slug = generateSlug(refinedData.name);
    } while (await this.categoryRepository.findOne({ slug }));

    const addedCategory = await this.categoryRepository.create({
      ...refinedData,
      slug,
    });
    return this.toDto(addedCategory);
  }
}
