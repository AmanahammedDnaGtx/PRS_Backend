import mongoose from "mongoose";

import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`${signal} received. Closing server gracefully...`);

    server.close(async () => {
      await mongoose.connection.close();
      console.log("HTTP server and MongoDB connection closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

void startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
