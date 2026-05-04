import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";

export const notFoundMiddleware = (
  request: Request,
  _response: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route not found: ${request.originalUrl}`));
};
