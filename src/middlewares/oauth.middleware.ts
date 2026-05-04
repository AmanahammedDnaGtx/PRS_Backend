import { Request, Response } from "express";

import { env } from "../config/env";
import { verifyOAuthToken } from "../services/oauth.service";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const getBearerToken = (request: Request): string => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    throw new ApiError(401, "Missing Authorization bearer token");
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new ApiError(401, "Authorization header must use Bearer token format");
  }

  return token;
};

export const oauthMiddleware = asyncHandler(
  async (request: Request, _response: Response, next) => {
    if (!env.auth.enabled) {
      next();
      return;
    }

    const accessToken = getBearerToken(request);
    const auth = await verifyOAuthToken(accessToken);

    request.accessToken = accessToken;
    request.auth = auth;

    next();
  }
);
