import fp from "fastify-plugin";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ResponseCode } from "../types/response-code";
import { ApiResponse } from "../types/api-response";
import { sendReply } from "../utils/send-response";
import { logger } from "@/config";

const prismaErrorMap: Record<
  string,
  { status: number; code: ResponseCode; msg: string }
> = {
  P2002: { status: 409, code: ResponseCode.CONFLICT, msg: "Unique violation" },
  P2025: { status: 404, code: ResponseCode.NOT_FOUND, msg: "Record not found" },
};

const customErrorMap: Record<string, { status: number; code: ResponseCode }> = {
  NotFoundError: { status: 404, code: ResponseCode.NOT_FOUND },
  ConflictError: { status: 409, code: ResponseCode.CONFLICT },
  BadRequestError: { status: 400, code: ResponseCode.BAD_REQUEST },
  UnauthorizedError: { status: 401, code: ResponseCode.UNAUTHORIZED },
  ForbiddenError: { status: 403, code: ResponseCode.FORBIDDEN },
  InternalServerError: {
    status: 500,
    code: ResponseCode.INTERNAL_SERVER_ERROR,
  },
};

export default fp(async (app: FastifyInstance) => {
  app.setErrorHandler((error, req, reply) => {
    let statusCode = 500;
    let responseCode = ResponseCode.INTERNAL_SERVER_ERROR;
    let message = "An unexpected error occurred";

    /* Prisma Errors */
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const map = prismaErrorMap[error.code];
      statusCode = map.status;
      responseCode = map.code;
      message = `${map.msg}: ${error.meta?.target || ""}`.trim();
    }
    // Zod validation errors
    else if (error instanceof ZodError) {
      statusCode = 400;
      responseCode = ResponseCode.BAD_REQUEST;
      message = error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
    }

    // AJV validation errors
    else if (error.code === "FST_ERR_VALIDATION") {
      statusCode = 400;
      responseCode = ResponseCode.BAD_REQUEST;
      message = error.message;
    }

    // 404 Route not found
    else if (error.code === "FST_ERR_NOT_FOUND") {
      statusCode = 404;
      responseCode = ResponseCode.NOT_FOUND;
      message = "Route not found";
    }

    // Other errors
    else if (customErrorMap[error.name]) {
      const map = customErrorMap[error.name];
      statusCode = map.status;
      responseCode = map.code;
      message = error.message || message;
    }

    error.message ? logger.warn(error.message) : logger.warn(message);

    return sendReply<ApiResponse>(
      reply,
      statusCode,
      responseCode,
      undefined,
      message,
      [message]
    );
  });
});
