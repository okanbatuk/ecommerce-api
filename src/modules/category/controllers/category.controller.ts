import { injectable, inject } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryFilter } from "../filters";
import { CategoryDto } from "../dtos/category.dto";
import type { ICategoryService } from "../interfaces";
import { BaseController, type SlugParam, TYPES } from "@/shared";
import type { AddCategoryInput, UpdateCategoryInput } from "../schemas";

@injectable()
export class CategoryController extends BaseController<
  CategoryDto,
  UpdateCategoryInput,
  CategoryFilter,
  ICategoryService
> {
  constructor(
    @inject(TYPES.CategoryService) categoryService: ICategoryService,
  ) {
    super(categoryService);
  }

  /* GET /category/slug/:slug */
  getBySlug = async (
    req: FastifyRequest<{ Params: SlugParam }>,
    res: FastifyReply,
  ): Promise<void> => {
    const category = this.service.getBySlug(req.params.slug);
    return this.ok(res, category, "Category");
  };

  /* POST /category */
  create = async (
    req: FastifyRequest<{ Body: AddCategoryInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    const addedCategory = await this.service.create(req.body);

    return this.created(res, addedCategory, "Category");
  };

  /* DELETE /category/:id */
  delete = async (
    req: FastifyRequest<{ Params: { id: number } }>,
    res: FastifyReply,
  ): Promise<void> => {
    await this.removeCore(req, res);
    return this.noContent(res, "Category");
  };
}
