import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify";
import { RES_MSG } from "../constants";
import { sendReply } from "../utils";

import { ResponseCode, type Pagination } from "../types";

@injectable()
export abstract class BaseController {
  constructor(
    protected readonly service: {
      findById: Function;
      findMany: Function;
      findAll?: Function;
      create?: Function;
      update?: Function;
      delete: Function;
    },
  ) {}

  protected resolvePagination(query: any): Required<Pagination> {
    return {
      limit: Math.max(1, Number(query.limit) || 20),
      offset: Math.max(0, Number(query.offset) || 0),
    };
  }

  protected buildFilter(query: any) {
    const { limit, offset, ...rest } = query;
    return Object.fromEntries(
      Object.entries(rest).filter(([, v]) => v !== undefined),
    );
  }

  private getEntity(label?: string): string {
    return label || this.constructor.name.replace("Controller", "");
  }

  protected ok(reply: FastifyReply, data: any | any[], label?: string) {
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

  protected created(reply: FastifyReply, data: any, label?: string) {
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
  ) => {
    const entity = await this.service.findById(Number(req.params.id));
    return this.ok(reply, entity);
  };

  search = async (
    req: FastifyRequest<{ Querystring: any }>,
    reply: FastifyReply,
  ) => {
    const filter = this.buildFilter(req.query);
    const result = await this.service.findMany(filter);
    return this.ok(reply, result);
  };

  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    await this.service.delete(Number(req.params.id));
    return this.noContent(reply, RES_MSG.DELETED("Entity"));
  };
}
