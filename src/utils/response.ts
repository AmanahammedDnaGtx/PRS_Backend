import { Response } from "express";

import { ErrorResponseOptions, SuccessResponseOptions } from "../types/response.types";

export const sendSuccess = <T>(
  response: Response,
  options: SuccessResponseOptions<T>
): void => {
  response.status(options.statusCode).json({
    success: true,
    message: options.message,
    data: options.data,
  });
};

export const sendError = (
  response: Response,
  options: ErrorResponseOptions
): void => {
  response.status(options.statusCode).json({
    success: false,
    message: options.message,
    details: options.details ?? null,
  });
};
