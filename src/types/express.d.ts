import { OAuthTokenPayload } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      accessToken?: string;
      auth?: OAuthTokenPayload;
    }
  }
}

export {};
