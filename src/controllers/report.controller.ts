import { Request, Response } from "express";

import { parseUploadedReportFile } from "../helpers/report.helper";
import { reportService } from "../services/report.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/response";

export const uploadReport = asyncHandler(async (request: Request, response: Response) => {
  if (!request.file) {
    throw new ApiError(400, "Please upload a JSON file using the 'file' field");
  }

  const payload = parseUploadedReportFile(request.file);
  const result = await reportService.upsertReport(payload);

  sendSuccess(response, {
    statusCode: result.action === "created" ? 201 : 200,
    message:
      result.action === "created"
        ? "Report uploaded and stored successfully"
        : "Report uploaded and existing record updated successfully",
    data: result,
  });
});

export const getReportById = asyncHandler(async (request: Request, response: Response) => {
  const report = await reportService.getReportById(request.params.reportId);

  sendSuccess(response, {
    statusCode: 200,
    message: "Report fetched successfully",
    data: report,
  });
});

export const getReportCategoriesById = asyncHandler(
  async (request: Request, response: Response) => {
    const categories = await reportService.getReportCategoriesById(request.params.reportId);

    sendSuccess(response, {
      statusCode: 200,
      message: "Report categories fetched successfully",
      data: categories,
    });
  }
);

export const getReportPhenotypeById = asyncHandler(
  async (request: Request, response: Response) => {
    const phenotype = await reportService.getPhenotypeById(
      request.params.reportId,
      request.params.phenotypeId
    );

    sendSuccess(response, {
      statusCode: 200,
      message: "Phenotype fetched successfully",
      data: phenotype,
    });
  }
);

export const getReportPhenotypesByCategory = asyncHandler(
  async (request: Request, response: Response) => {
    const phenotypes = await reportService.getPhenotypesByCategory(
      request.params.reportId,
      request.params.categoryName
    );

    sendSuccess(response, {
      statusCode: 200,
      message: "Category phenotypes fetched successfully",
      data: phenotypes,
    });
  }
);
