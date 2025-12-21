import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError } from "@/shared/exceptions/conflict.error";
import { NotFoundError } from "@/shared/exceptions/not-found.error";
import { ICategoryRepository } from "@modules/category/interfaces/category-repository.interface";
import { CategoryService } from "@modules/category/services/category.service";
import { mockCategoryRepository } from "../../mocks";

describe("Category Service", () => {
  let repo: ICategoryRepository;
  let service: CategoryService;

  beforeEach(() => {
    repo = mockCategoryRepository();
    service = new CategoryService(repo);
  });

  it("should return categories when found", async () => {
    const result = await service.findMany();

    expect(result).toHaveLength(5);
  });

  it("should return categories filtered by search and parentId", async () => {
    // search by name or slug
    const resultByName = await service.findMany({ search: "Elect" });
    expect(resultByName).toHaveLength(4);
    expect(resultByName.map((c) => c.slug)).toEqual(
      expect.arrayContaining([
        "electronic",
        "electronic-computer",
        "electronic-fridge",
        "electronic-smartphone",
      ]),
    );

    // filter by parentId
    const resultByParent = await service.findMany({ parentId: 1 });
    expect(resultByParent).toHaveLength(3);
    expect(resultByParent.map((c) => c.name)).toEqual(
      expect.arrayContaining(["Computer", "Fridge", "Smartphone"]),
    );

    // filter by search and parentId
    const resultCombined = await service.findMany({
      parentId: 1,
      search: "smart",
    });
    expect(resultCombined).toHaveLength(1);
    expect(resultCombined[0].name).toBe("Smartphone");
  });

  it("should include deleted categories if requested (admin use case)", async () => {
    const result = await service.findMany({}, { includeDeleted: true });

    expect(result).toHaveLength(6);
    expect(result.some((c) => c.name === "Tv")).toBe(true);
  });

  it("should throw NotFoundError when no categories found", async () => {
    repo.findMany = vi.fn(async () => []);

    await expect(service.findMany()).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should return category by id", async () => {
    const result = await service.findById(1);

    expect(result.id).toBe(1);
    expect(result.slug).toBe("electronic");
  });

  it("should throw NotFoundError if category does not exist", async () => {
    await expect(service.findById(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("should create a new category", async () => {
    const result = await service.create({
      name: "Laptop",
      parentId: 1,
    });

    expect(result.name).toBe("Laptop");
    expect(result.slug).toBe("electronic-laptop");
  });

  it("should throw ConflictError if slug already exists", async () => {
    await expect(service.create({ name: "Electronic" })).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("should update category name and slug", async () => {
    const result = await service.update(1, {
      name: "Electronic & Tech",
    });

    expect(result.name).toBe("Electronic & Tech");
    expect(result.slug).toContain("electronic");
  });

  it("should throw NotFoundError when updating non-existing category", async () => {
    await expect(service.update(999, { name: "X" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("should delete category", async () => {
    await expect(service.delete(1)).resolves.toBeUndefined();
  });

  it("should reduce category count after deletion", async () => {
    const initialCategories = await service.findMany();
    expect(initialCategories.length).toBe(5);

    await service.delete(1);

    // remaining categories after deletion
    const remainingCategories = await service.findMany();
    expect(remainingCategories.length).toBe(4);
    expect(remainingCategories.some((c) => c.id === 1)).toBe(false);
  });

  it("should restore category", async () => {
    const result = await service.restore(4);
    expect(result.isDeleted).toBe(false);
  });
});
