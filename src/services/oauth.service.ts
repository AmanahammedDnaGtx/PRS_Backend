import { Buffer } from "node:buffer";

import { env } from "../config/env";
import { OAuthTokenPayload } from "../types/auth.types";
import { ApiError } from "../utils/ApiError";

const hasExpectedAudience = (tokenAudience: string | string[] | undefined): boolean => {
  if (!env.auth.audience) {
    return true;
  }

  if (Array.isArray(tokenAudience)) {
    return tokenAudience.includes(env.auth.audience);
  }

  return tokenAudience === env.auth.audience;
};

const validateTokenClaims = (payload: OAuthTokenPayload): void => {
  if (env.auth.issuer && payload.iss !== env.auth.issuer) {
    throw new ApiError(401, "OAuth token issuer is not trusted");
  }

  if (!hasExpectedAudience(payload.aud)) {
    throw new ApiError(401, "OAuth token audience is not allowed");
  }
};

const buildIntrospectionHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (env.auth.clientId && env.auth.clientSecret) {
    const credentials = Buffer.from(
      `${env.auth.clientId}:${env.auth.clientSecret}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  return headers;
};

export const verifyOAuthToken = async (token: string): Promise<OAuthTokenPayload> => {
  if (!env.auth.introspectionUrl) {
    throw new ApiError(500, "OAuth introspection URL is not configured");
  }

  const body = new URLSearchParams({ token });

  if (env.auth.clientId && !env.auth.clientSecret) {
    body.set("client_id", env.auth.clientId);
  }

  const introspectionResponse = await fetch(env.auth.introspectionUrl, {
    method: "POST",
    headers: buildIntrospectionHeaders(),
    body,
  });

  if (!introspectionResponse.ok) {
    throw new ApiError(401, "OAuth token could not be verified");
  }

  const payload = (await introspectionResponse.json()) as OAuthTokenPayload;

  if (!payload.active) {
    throw new ApiError(401, "OAuth token is inactive or expired");
  }

  validateTokenClaims(payload);

  return payload;
};
