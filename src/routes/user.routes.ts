import { Router } from "express";

import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  createUserSchema,
  userIdParamsSchema,
} from "../utils/user.validation";

const router = Router();

router.post("/", validateRequest(createUserSchema), createUser);
router.get("/", getAllUsers);
router.get("/:userId", validateRequest(userIdParamsSchema), getUserById);

export default router;
