import { Role, sendReply } from "@/shared";
import { BaseController } from "@/shared/core/base.controller";
import type { FastifyReply, FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { baseServiceMock } from "../mocks";

type GetByIdReq = FastifyRequest<{ Params: { id: string } }>;

vi.mock("@/shared/utils", () => ({
  sendReply: vi.fn(),
}));

class TestController extends BaseController<any> {
  protected override resolveFindOptions() {
    return { includeDeleted: true };
  }
}

describe("BaseController", () => {
  let controller: TestController;

  const replyMock = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  } as unknown as FastifyReply;

  const requestMock = {
    params: { id: "1" },
    user: { role: Role.ADMIN },
  } as unknown as GetByIdReq;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new TestController(baseServiceMock as any);
  });

  it("getById → calls service.findById and sendReply", async () => {
    const dto = { id: 1 };

    baseServiceMock.findById.mockResolvedValue(dto);

    await controller.getById(requestMock, replyMock);

    expect(baseServiceMock.findById).toHaveBeenCalledWith(1, {
      includeDeleted: true,
    });

    expect(sendReply).toHaveBeenCalledWith(
      replyMock,
      200,
      expect.anything(),
      dto,
      expect.any(String),
    );
  });

  it("delete → calls service.delete and noContent reply", async () => {
    await controller.delete(requestMock, replyMock);

    expect(baseServiceMock.delete).toHaveBeenCalledWith(1);
    expect(sendReply).toHaveBeenCalledWith(
      replyMock,
      200,
      expect.anything(),
      null,
      expect.any(String),
    );
  });

  it("deletePermanently → calls service.deletePermanently and sends NO_CONTENT response", async () => {
    baseServiceMock.deletePermanently.mockResolvedValue();

    await controller.deletePermanently(requestMock, replyMock);

    expect(baseServiceMock.deletePermanently).toHaveBeenCalledWith(1);

    expect(sendReply).toHaveBeenCalledWith(
      replyMock,
      200,
      expect.anything(),
      null,
      expect.any(String),
    );
  });

  it("deletePermanently → calls service.deletePermanently and sends NO_CONTENT response", async () => {
    baseServiceMock.deletePermanently.mockResolvedValue();

    await controller.deletePermanently(requestMock, replyMock);

    expect(baseServiceMock.deletePermanently).toHaveBeenCalledWith(1);

    expect(sendReply).toHaveBeenCalledWith(
      replyMock,
      200,
      expect.anything(),
      null,
      expect.any(String),
    );
  });
});
