import { injectable } from "inversify";
import { FastifyReply, FastifyRequest } from "fastify";
import { sendReply } from "../utils";
import { RES_MSG, Role } from "../constants";

import type { IService } from "../interfaces";
import { type Pagination, ResponseCode } from "../types";
import { logger } from "@/config";

@injectable()
export abstract class BaseController<
  T,
  U = Partial<T>,
  F = Partial<T>,
  S extends IService<T, U, F> = IService<T, U, F>,
> {
  constructor(protected readonly service: any) {}

  protected async assertExists(id: string, isAdmin: boolean): Promise<T> {
    return this.service.findOne({ id } as F);
  }

  private resolvePagination(query: any): Required<Pagination> {
    return {
      limit: Math.max(1, Number(query.limit) || 20),
      offset: Math.max(0, Number(query.offset) || 0),
    };
  }

  private buildFilter(query: any): F {
    const { limit, offset, ...rest } = query;
    return Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    ) as F;
  }

  private getEntity(label?: string): string {
    return label || this.constructor.name.replace("Controller", "");
  }

  protected ok(reply: FastifyReply, data: T | T[], label?: string) {
    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      data,
      Array.isArray(data) && data.length
        ? RES_MSG.ALL(this.getEntity(label))
        : RES_MSG.FOUND(this.getEntity(label)),
    );
  }

  protected created(reply: FastifyReply, data: T, label?: string) {
    return sendReply(
      reply,
      200,
      ResponseCode.CREATED,
      data,
      RES_MSG.CREATED(this.getEntity(label)),
    );
  }

  protected updated(reply: FastifyReply, label?: string) {
    return sendReply(
      reply,
      200,
      ResponseCode.OK,
      null,
      RES_MSG.UPDATED(this.getEntity(label)),
    );
  }

  protected noContent(reply: FastifyReply, label?: string) {
    return sendReply(
      reply,
      200,
      ResponseCode.NO_CONTENT,
      null,
      RES_MSG.DELETED(this.getEntity(label)),
    );
  }

  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const entity = await this.assertExists(
      req.params.id,
      req.user.role === Role.ADMIN,
    );
    return this.ok(reply, entity);
  };

  search = async (
    req: FastifyRequest<{ Querystring: any }>,
    reply: FastifyReply,
  ): Promise<void> => {
    const pagination = this.resolvePagination(req.query);
    const filter = this.buildFilter(req.query);
    // TODO: Normalize to req.query.

    const result = Object.keys(filter as Record<string, any>).length
      ? await this.service.findMany(filter, pagination)
      : await this.service.findAll(pagination);

    return this.ok(reply, result);
  };

  protected updateCore = async (
    req: FastifyRequest<{ Params: { id: string }; Body: U }>,
    reply: FastifyReply,
    normalizer: (body: U) => U = (b) => b,
  ): Promise<void> => {
    await this.assertExists(req.params.id, req.user.role === Role.ADMIN);
    const refined: U = normalizer(req.body as U);
    await this.service.update(req.params.id, refined);
    return this.updated(reply);
  };

  removeCore = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> => {
    await this.assertExists(req.params.id, req.user.role === Role.ADMIN);
    await this.service.delete(req.params.id);
  };
}
