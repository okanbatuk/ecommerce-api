import { CategoryService } from "@/modules/category/service";
import { ConflictError, NotFoundError } from "@/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockCategoryRepository } from "../../mocks";

import type { ICategoryRepository } from "@/modules/category/interfaces/repository";
import type { ICategoryService } from "@/modules/category/interfaces/service";

describe("Category Service", () => {
  let repo: ICategoryRepository;
  let service: ICategoryService;

  beforeEach(() => {
    repo = new MockCategoryRepository();
    service = new CategoryService(repo);
  });

  describe("findMany visibility rules", () => {
    it("should return categories when found", async () => {
      const result = await service.findMany({});

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
      const result = await service.findMany({
        options: { includeDeleted: true },
      });

      expect(result).toHaveLength(7);
      expect(result.some((c) => c.name === "Tv")).toBe(true);
    });

    it("should throw NotFoundError when no categories found", async () => {
      repo.findMany = vi.fn(async () => []);

      await expect(service.findMany({})).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should NOT include deleted categories by default", async () => {
      const result = await service.findMany({});

      expect(result.some((c) => c.isDeleted)).toBe(false);
      expect(result.find((c) => c.id === 4)).toBeUndefined();
    });
  });

  describe("findById visibility rules", () => {
    it("should return category by id", async () => {
      const result = await service.findById(1);

      expect(result.id).toBe(1);
      expect(result.slug).toBe("electronic");
      expect(result.isDeleted).toBe(false);
    });

    it("should throw NotFoundError if category does not exist", async () => {
      await expect(service.findById(999)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should throw NotFoundError if category is deleted (default behavior)", async () => {
      await expect(service.findById(4)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should return deleted category if includeDeleted option is true", async () => {
      const result = await service.findById(4, { includeDeleted: true });

      expect(result.id).toBe(4);
      expect(result.isDeleted).toBe(true);
    });
  });

  describe("findBySlug", () => {
    it("should return category by slug (non-deleted by default)", async () => {
      const category = await service.findBySlug("electronic");
      expect(category.slug).toBe("electronic");
      expect(category.isDeleted).toBe(false);
    });

    it("should include deleted category if includeDeleted is true", async () => {
      const category = await service.findBySlug("electronic-tv", {
        includeDeleted: true,
      });
      expect(category.slug).toBe("electronic-tv");
      expect(category.isDeleted).toBe(true);
    });

    it("should throw NotFoundError if category not found", async () => {
      await expect(service.findBySlug("non-existent")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("should throw NotFoundError if category is deleted (default behavior)", async () => {
      await expect(service.findBySlug("electronic-tv")).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe("findRoots", () => {
    it("should return root categories by default (non-deleted)", async () => {
      const roots = await service.findRoots();
      expect(roots.every((c) => c.parentId === null)).toBe(true);
      expect(roots.some((c) => c.isDeleted)).toBe(false);
    });

    it("should include deleted roots if includeDeleted is true", async () => {
      const roots = await service.findRoots({ includeDeleted: true });
      expect(roots.some((c) => c.isDeleted)).toBe(true);
    });

    it("should throw NotFoundError if no roots found", async () => {
      repo.findRoots = vi.fn(async () => []);
      await expect(service.findRoots()).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("findChildren", () => {
    it("should return children of a given parent (non-deleted by default)", async () => {
      const children = await service.findChildren(1);
      expect(children.every((c) => c.parentId === 1)).toBe(true);
      expect(children.some((c) => c.isDeleted)).toBe(false);
    });

    it("should include deleted children if includeDeleted is true", async () => {
      const children = await service.findChildren(1, { includeDeleted: true });
      expect(children.some((c) => c.isDeleted)).toBe(true);
    });

    it("should throw NotFoundError if no children found", async () => {
      repo.findChildren = vi.fn(async () => []);
      await expect(service.findChildren(999)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe("create rules", () => {
    it("should create a new category", async () => {
      const result = await service.create({
        name: "Laptop",
        parentId: 1,
      });

      expect(result.name).toBe("Laptop");
      expect(result.slug).toBe("electronic-laptop");
    });

    it("should throw ConflictError if slug already exists", async () => {
      await expect(
        service.create({ name: "Electronic" }),
      ).rejects.toBeInstanceOf(ConflictError);
    });
  });

  describe("update rules", () => {
    it("should update category name and slug", async () => {
      const result = await service.update(1, {
        name: "Electronic & Tech",
      });

      expect(result.name).toBe("Electronic & Tech");
      expect(result.slug).toContain("electronic-tech");
    });

    it("should throw NotFoundError when updating non-existing category", async () => {
      await expect(service.update(999, { name: "X" })).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("should throw ConflictError if updated slug conflicts with another category", async () => {
      await expect(
        service.update(3, {
          name: "Computer",
        }),
      ).rejects.toBeInstanceOf(ConflictError);
    });

    it("should throw ConflictError if category is set as its own parent", async () => {
      await expect(service.update(1, { parentId: 1 })).rejects.toBeInstanceOf(
        ConflictError,
      );
    });
  });

  describe("delete & restore edge cases", () => {
    it("should not fail when deleting an already deleted category (idempotent)", async () => {
      await service.delete(4);
      const softDeleted = await service.findById(4, { includeDeleted: true });
      expect(softDeleted.isDeleted).toBe(true);

      await expect(service.delete(4)).resolves.toBeUndefined();

      const check = await service.findById(4, { includeDeleted: true });
      expect(check.isDeleted).toBe(true);
    });

    it("should not fail when restoring an already active category (idempotent)", async () => {
      const cat = await service.findById(1);
      expect(cat.isDeleted).toBe(false);

      await expect(service.restore(1)).resolves.toBeDefined();

      const check = await service.findById(1);
      expect(check.isDeleted).toBe(false);
    });

    it("should restore a soft-deleted category", async () => {
      await service.delete(4);
      const softDeleted = await service.findById(4, { includeDeleted: true });
      expect(softDeleted.isDeleted).toBe(true);

      const restored = await service.restore(4);
      expect(restored.isDeleted).toBe(false);
    });

    it("should throw NotFoundError if trying to delete non-existing category", async () => {
      await expect(service.delete(999)).rejects.toBeInstanceOf(NotFoundError);
    });

    it("should throw NotFoundError if trying to restore non-existing category", async () => {
      await expect(service.restore(999)).rejects.toBeInstanceOf(NotFoundError);
    });
  });
  describe("deletePermanently rules", () => {
    it("should permanently delete an existing category", async () => {
      await expect(service.deletePermanently(2)).resolves.toBeUndefined();

      const categories = await service.findMany({
        options: { includeDeleted: true },
      });
      expect(categories.some((c) => c.id === 2)).toBe(false);
    });

    it("should throw NotFoundError when deleting a non-existing category", async () => {
      await expect(service.deletePermanently(999)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });

    it("should permanently delete an already soft-deleted category", async () => {
      await service.delete(4);
      const softDeleted = await service.findById(4, { includeDeleted: true });
      expect(softDeleted.isDeleted).toBe(true);

      await expect(service.deletePermanently(4)).resolves.toBeUndefined();

      const categories = await service.findMany({
        options: { includeDeleted: true },
      });
      expect(categories.some((c) => c.id === 4)).toBe(false);
    });
  });
});
