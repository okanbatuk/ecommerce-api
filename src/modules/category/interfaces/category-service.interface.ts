import { CategoryFilter } from "../filters";
import { ICreatable, IService } from "@/shared";
import { CategoryDto } from "../dtos/category.dto";
import { AddCategoryInput, UpdateCategoryInput } from "../schemas";

export interface ICategoryService
  extends IService<CategoryDto, UpdateCategoryInput, CategoryFilter>,
    ICreatable<CategoryDto, AddCategoryInput> {}
