declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    API_PREFIX?: string;
    MONGODB_URI?: string;
    AUTH_ENABLED?: string;
    OAUTH_INTROSPECTION_URL?: string;
    OAUTH_CLIENT_ID?: string;
    OAUTH_CLIENT_SECRET?: string;
    OAUTH_ISSUER?: string;
    OAUTH_AUDIENCE?: string;
  }
}

export {};
