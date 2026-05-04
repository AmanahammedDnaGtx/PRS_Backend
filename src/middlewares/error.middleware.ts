import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { ZodError } from "zod";

import { sendError } from "../utils/response";

type ErrorResponse = {
  statusCode: number;
  message: string;
  details?: unknown;
};

const buildErrorResponse = (error: unknown): ErrorResponse => {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      message: "Validation failed",
      details: error.flatten().fieldErrors,
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      statusCode: 400,
      message: "Database validation failed",
      details: Object.values(error.errors).map((item) => item.message),
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      statusCode: 400,
      message: "Invalid resource id",
    };
  }

  if (error instanceof multer.MulterError) {
    return {
      statusCode: 400,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded file is too large. Maximum size is 25MB"
          : error.message,
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    Number(error.code) === 11000
  ) {
    return {
      statusCode: 409,
      message: "A record with one of the unique fields already exists",
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  ) {
    return {
      statusCode: Number(error.statusCode),
      message: String(error.message),
    };
  }

  return {
    statusCode: 500,
    message: "Internal server error",
  };
};

export const errorMiddleware = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
): void => {
  const formattedError = buildErrorResponse(error);

  sendError(response, {
    statusCode: formattedError.statusCode,
    message: formattedError.message,
    details: formattedError.details,
  });
};
