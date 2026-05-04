import { Router } from "express";

import reportRoutes from "./report.routes";
import userRoutes from "./user.routes";

const router = Router();

router.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/users", userRoutes);
router.use("/reports", reportRoutes);

export default router;
