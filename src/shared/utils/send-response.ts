import { FastifyReply } from "fastify";
import { ApiResponse } from "../types/api-response";
import { ResponseCode } from "../types/response-code";

export const sendReply = <T>(
  res: FastifyReply,
  statusCode: number,
  responseCode: ResponseCode,
  data?: T,
  message?: string,
  errors?: string[]
): FastifyReply => {
  const payload: ApiResponse<T> = {
    success: statusCode < 400,
    statusCode,
    responseCode,
    data,
    message,
    errors,
  };
  return res.status(statusCode).send(payload);
};
