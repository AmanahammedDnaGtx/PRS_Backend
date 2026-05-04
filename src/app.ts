import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { openApiSpec } from "./docs/openapi";
import apiRoutes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { oauthMiddleware } from "./middlewares/oauth.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.get("/docs.json", (_request, response) => {
  response.status(200).json(openApiSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(env.apiPrefix, oauthMiddleware, apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
