import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ResponseCode } from "../types/response-code";
import { ApiResponse } from "../types/api-response";

export default fp(async (app: FastifyInstance) => {
  app.setErrorHandler((error, req, reply) => {
    let statusCode = 500;
    let responseCode = ResponseCode.INTERNAL_SERVER_ERROR;
    let errors: string[] = [];

    /* Prisma Errors */
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint failed
          statusCode = 409;
          responseCode = ResponseCode.CONFLICT;
          errors = [`Unique violation: ${error.meta?.target ?? ""}`];
          break;
        case "P2025": // Record not found
          statusCode = 404;
          responseCode = ResponseCode.NOT_FOUND;
          errors = ["Record not found"];
          break;
        
        default:
          errors = [error.message];
          break;
      }
    }

    // Zod validation errors
    else if (error instanceof ZodError) {
      statusCode = 400;
      responseCode = ResponseCode.BAD_REQUEST;
      errors = error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    }

    // Fastify validation errors
    else if (error.validation) {
      statusCode = 400;
      responseCode = ResponseCode.BAD_REQUEST;
      errors = error.validation.map((e: any) => e.message);
    }

    // 404 Route not found
    else if (error.code === "FST_ERR_NOT_FOUND") {
      statusCode = 404;
      responseCode = ResponseCode.NOT_FOUND;
      errors = ["Route not found"];
    }

    // Other errors
    else {
      errors = [error.message || "An unexpected error occurred"];
    }

    const payload: ApiResponse<null> = {
      success: statusCode < 400,
      statusCode,
      responseCode,
      message: errors[0] || "An error occurred",
      errors,
    };

    reply.status(statusCode).send(payload);
  });
});
