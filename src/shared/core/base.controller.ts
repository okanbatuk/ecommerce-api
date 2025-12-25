import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify";
import { RES_MSG } from "../constants";
import { sendReply } from "../utils";

import type { IDeletable, IReadable } from "../interfaces";
import { ResponseCode, type FindOptions, type Pagination } from "../types";

@injectable()
export abstract class BaseController<TDto> {
  constructor(
    protected readonly service: IReadable<unknown, TDto> & IDeletable,
  ) {}

  protected resolvePagination(query: any): Required<Pagination> {
    return {
      limit: Math.max(1, Number(query.limit) || 20),
      offset: Math.max(0, Number(query.offset) || 0),
    };
  }

  protected resolveFindOptions(_req: FastifyRequest): FindOptions {
    return {};
  }

  protected buildFilter(query: any): Record<string, unknown> {
    const { limit, offset, ...rest } = query;
    return Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
  }

  private getEntity(label?: string): string {
    return label || this.constructor.name.replace("Controller", "");
  }

  protected ok(reply: FastifyReply, data: any | any[], label?: string): void {
    sendReply(
      reply,
      200,
      ResponseCode.OK,
      data,
      Array.isArray(data) && data.length
        ? RES_MSG.ALL(this.getEntity(label))
        : RES_MSG.FOUND(this.getEntity(label)),
    );
  }

  protected created(reply: FastifyReply, data: any, label?: string): void {
    sendReply(
      reply,
      200,
      ResponseCode.CREATED,
      data,
      RES_MSG.CREATED(this.getEntity(label)),
    );
  }

  protected updated(reply: FastifyReply, label?: string): void {
    sendReply(
      reply,
      200,
      ResponseCode.OK,
      null,
      RES_MSG.UPDATED(this.getEntity(label)),
    );
  }

  protected noContent(reply: FastifyReply, label?: string): void {
    sendReply(
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
  ) => {
    const entity = await this.service.findById(
      Number(req.params.id),
      this.resolveFindOptions(req),
    );
    this.ok(reply, entity);
  };

  delete = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.service.delete(Number(req.params.id));
    this.noContent(reply, RES_MSG.DELETED("Entity"));
  };

  deletePermanently = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.service.deletePermanently(Number(req.params.id));
    this.noContent(reply, RES_MSG.DELETED("Entity"));
  };
}
