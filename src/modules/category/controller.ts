import { injectable, inject } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryQuery } from "./filters";
import { CategoryDto } from "./dtos/category.dto";
import { FindOptions, TYPES } from "@/shared";
import type { ICategoryService } from "./interfaces/service";
import type { AddCategoryInput } from "./schemas/add-input";
import type { UpdateCategoryInput } from "./schemas/update-input";
import { BaseController } from "@/shared/core/base.controller";
import { SlugParam } from "@/shared/schemas/slug-param";
import { Role } from "@prisma/client";
import { CategorySearchType } from "./schemas/search-input";

@injectable()
export class CategoryController extends BaseController<CategoryDto> {
  constructor(
    @inject(TYPES.CategoryService) private categoryService: ICategoryService,
  ) {
    super(categoryService);
  }

  protected override resolveFindOptions(req: FastifyRequest): FindOptions {
    return {
      includeDeleted: req.user?.role === Role.ADMIN,
    };
  }

  /**
   * GET /categories
   */
  search = async (
    req: FastifyRequest<{ Querystring: CategorySearchType }>,
    reply: FastifyReply,
  ) => {
    let includeDeleted = false;
    if (req.user?.role === Role.ADMIN) {
      includeDeleted = req.query.includeDeleted ?? false;
    }

    const query: CategoryQuery = {
      id: req.query.id,
      name: req.query.name,
      slug: req.query.slug,
      parentId: req.query.parentId,

      search: req.query.search,

      options: {
        includeDeleted,
      },
    };

    const result = await this.categoryService.findMany(query);
    this.ok(reply, result, "Category");
  };

  /* GET /categories/slug/:slug */
  getBySlug = async (
    req: FastifyRequest<{ Params: SlugParam }>,
    res: FastifyReply,
  ): Promise<void> => {
    const category = await this.categoryService.findBySlug(
      req.params.slug,
      this.resolveFindOptions(req),
    );
    this.ok(res, category, "Category");
  };

  /**
   * GET /categories/:id
   */
  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
  ): Promise<void> => {
    const category = await this.categoryService.findById(
      Number(req.params.id),
      this.resolveFindOptions(req),
    );
    this.ok(res, category, "Category");
  };

  /**
   * GET /categories/roots
   */
  getRoots = async (req: FastifyRequest, reply: FastifyReply) => {
    const result = await this.categoryService.findRoots(
      this.resolveFindOptions(req),
    );
    this.ok(reply, result, "Category");
  };

  /**
   * GET /categories/:id/children
   */
  getChildren = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const result = await this.categoryService.findChildren(
      Number(req.params.id),
      this.resolveFindOptions(req),
    );

    this.ok(reply, result, "Category");
  };

  /* POST /category */
  create = async (
    req: FastifyRequest<{ Body: AddCategoryInput }>,
    res: FastifyReply,
  ): Promise<void> => {
    const addedCategory = await this.categoryService.create(req.body);

    this.created(res, addedCategory, "Category");
  };

  /**
   * PUT /categories/:id
   */
  update = async (
    req: FastifyRequest<{
      Params: { id: string };
      Body: UpdateCategoryInput;
    }>,
    reply: FastifyReply,
  ) => {
    const updated = await this.categoryService.update(
      Number(req.params.id),
      req.body,
    );

    this.ok(reply, updated, "Category");
  };

  /**
   * POST /categories/:id/restore
   */
  restore = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const restored = await this.categoryService.restore(Number(req.params.id));

    this.ok(reply, restored, "Category");
  };

  /**
   * DELETE /categories/:id
   */
  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.categoryService.delete(Number(req.params.id));

    this.noContent(reply, "Category");
  };

  /**
   * DELETE /categories/:id/force
   */
  deletePermanently = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.categoryService.deletePermanently(Number(req.params.id));

    this.noContent(reply, "Category");
  };
}
