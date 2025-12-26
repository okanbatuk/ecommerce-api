import type { FastifyReply, FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared", async () => {
  const actual = await vi.importActual<any>("@/shared");
  return {
    ...actual,
    sendReply: vi.fn(),
  };
});

import { CategoryController } from "@/modules/category/controller";
import { Role, sendReply } from "@/shared";

import {
  adminUserMock,
  categoryServiceMock,
  mockCategoryDto,
  userMock,
} from "../../mocks";
import { AddCategoryInput } from "@/modules/category/schemas/add-input";
import { UpdateCategoryInput } from "@/modules/category/schemas/update-input";

describe("CategoryController", () => {
  let ctrl: CategoryController;
  let reqAdmin: Partial<FastifyRequest>;
  let reqUser: Partial<FastifyRequest>;
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    vi.clearAllMocks();

    ctrl = new CategoryController(categoryServiceMock as any);

    reqAdmin = {
      params: {},
      body: {},
      query: {},
      user: adminUserMock,
    };

    reqUser = {
      params: {},
      body: {},
      query: {},
      user: userMock,
    };

    reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  describe("getBySlug", () => {
    it("should call service.findBySlug and sendReply", async () => {
      reqAdmin = { ...reqAdmin, params: { slug: "electronic" } };

      const okSpy = vi.spyOn(ctrl as any, "ok");
      await ctrl.getBySlug(reqAdmin as any, reply as any);

      expect(categoryServiceMock.findBySlug).toHaveBeenCalledWith(
        "electronic",
        {
          includeDeleted: true,
        },
      );
      expect(okSpy).toHaveBeenCalledWith(reply, mockCategoryDto, "Category");
    });
  });

  describe("search", () => {
    it("should call service.findMany and sendReply", async () => {
      reqAdmin = { query: {} };
      const okSpy = vi.spyOn(ctrl as any, "ok");
      await ctrl.search(reqAdmin as any, reply as any);

      expect(categoryServiceMock.findMany).toHaveBeenCalled();
      expect(okSpy).toHaveBeenCalledWith(reply, [mockCategoryDto], "Category");
    });
  });

  describe("getChildren", () => {
    it("should call service.findChildren and sendReply", async () => {
      reqAdmin = { params: { id: "1" } };
      const okSpy = vi.spyOn(ctrl as any, "ok");

      await ctrl.getChildren(reqAdmin as any, reply as any);

      expect(categoryServiceMock.findChildren).toHaveBeenCalledWith(1);

      expect(okSpy).toHaveBeenCalledWith(reply, [mockCategoryDto], "Category");
    });
  });

  describe("getRoots", () => {
    it("should call service.findRoots and sendReply", async () => {
      const okSpy = vi.spyOn(ctrl as any, "ok");

      await ctrl.getRoots(reqAdmin as any, reply as any);

      expect(categoryServiceMock.findRoots).toHaveBeenCalled();

      expect(okSpy).toHaveBeenCalledWith(reply, [mockCategoryDto], "Category");
    });
  });

  describe("create", () => {
    it("should create category and call created", async () => {
      const createdSpy = vi.spyOn(ctrl as any, "created");
      const mockCreateCategoryDto: AddCategoryInput = {
        name: "Test Category",
      };

      reqAdmin.body = mockCreateCategoryDto;

      await ctrl.create(reqAdmin as any, reply as any);

      expect(categoryServiceMock.create).toHaveBeenCalledWith(
        mockCreateCategoryDto,
      );

      expect(createdSpy).toHaveBeenCalledWith(
        reply,
        mockCategoryDto,
        "Category",
      );
    });
  });

  describe("update", () => {
    it("should update category and call ok", async () => {
      const okSpy = vi.spyOn(ctrl as any, "ok");

      const mockUpdateCategoryDto: UpdateCategoryInput = {
        name: "Updated Category",
      };

      reqAdmin.params = { id: "1" };
      reqAdmin.body = mockUpdateCategoryDto;

      await ctrl.update(reqAdmin as any, reply as any);

      expect(categoryServiceMock.update).toHaveBeenCalledWith(
        1,
        mockUpdateCategoryDto,
      );

      expect(okSpy).toHaveBeenCalledWith(reply, mockCategoryDto, "Category");
    });
  });

  describe("restore", () => {
    it("should restore category and call ok", async () => {
      const okSpy = vi.spyOn(ctrl as any, "ok");

      reqAdmin.params = { id: "1" };

      await ctrl.restore(reqAdmin as any, reply as any);

      expect(categoryServiceMock.restore).toHaveBeenCalledWith(1);

      expect(okSpy).toHaveBeenCalledWith(reply, mockCategoryDto, "Category");
    });
  });
});
