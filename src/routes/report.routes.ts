import { Router } from "express";

import {
  getReportById,
  getReportCategoriesById,
  getReportPhenotypesByCategory,
  getReportPhenotypeById,
  uploadReport,
} from "../controllers/report.controller";
import { uploadSingleJsonFile } from "../middlewares/uploadJson.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import {
  reportCategoryPhenotypesParamsSchema,
  reportIdParamsSchema,
  reportPhenotypeParamsSchema,
} from "../utils/report.validation";

const router = Router();

router.post("/upload", uploadSingleJsonFile, uploadReport);
router.get(
  "/:reportId/categories/:categoryName/phenotypes",
  validateRequest(reportCategoryPhenotypesParamsSchema),
  getReportPhenotypesByCategory
);
router.get(
  "/:reportId/categories",
  validateRequest(reportIdParamsSchema),
  getReportCategoriesById
);
router.get(
  "/:reportId/phenotypes/:phenotypeId",
  validateRequest(reportPhenotypeParamsSchema),
  getReportPhenotypeById
);
router.get("/:reportId", validateRequest(reportIdParamsSchema), getReportById);

export default router;
