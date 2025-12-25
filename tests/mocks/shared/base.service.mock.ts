import { vi } from "vitest";

export const baseServiceMock = {
  findById: vi.fn<(id: number, options?: any) => Promise<unknown>>(),
  delete: vi.fn<(id: number) => Promise<void>>(),
  deletePermanently: vi.fn<(id: number) => Promise<void>>(),
};
