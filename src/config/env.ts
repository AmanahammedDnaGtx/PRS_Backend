import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanEnvSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  return value;
}, z.boolean());

const optionalEnvString = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().trim().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default("/api/v1"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  AUTH_ENABLED: booleanEnvSchema.default(false),
  OAUTH_INTROSPECTION_URL: optionalEnvString,
  OAUTH_CLIENT_ID: optionalEnvString,
  OAUTH_CLIENT_SECRET: optionalEnvString,
  OAUTH_ISSUER: optionalEnvString,
  OAUTH_AUDIENCE: optionalEnvString,
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  apiPrefix: parsedEnv.data.API_PREFIX,
  mongoUri: parsedEnv.data.MONGODB_URI,
  auth: {
    enabled: parsedEnv.data.AUTH_ENABLED,
    introspectionUrl: parsedEnv.data.OAUTH_INTROSPECTION_URL,
    clientId: parsedEnv.data.OAUTH_CLIENT_ID,
    clientSecret: parsedEnv.data.OAUTH_CLIENT_SECRET,
    issuer: parsedEnv.data.OAUTH_ISSUER,
    audience: parsedEnv.data.OAUTH_AUDIENCE,
  },
};
