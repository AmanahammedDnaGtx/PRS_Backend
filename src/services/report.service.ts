import {
  buildReportCategoriesResponse,
  buildReportCategoryPhenotypesResponse,
  buildReportPhenotypeResponse,
  buildReportResponse,
  getPhenotypeCategoryNames,
} from "../helpers/report.helper";
import { Report } from "../models/report.model";
import { ApiError } from "../utils/ApiError";
import {
  ReportCategoriesResponse,
  ReportCategoryPhenotypesResponse,
  ReportFilePayload,
  ReportCategoryPhenotypeItem,
  ReportPhenotypeData,
  ReportPhenotypeResponse,
  ReportResponse,
} from "../types/report.types";

const upsertReport = async (
  payload: ReportFilePayload
): Promise<{ action: "created" | "updated"; report: ReportResponse }> => {
  const reportId = payload.sample.id.trim();
  const existingReport = await Report.findById(reportId).select("_id phenotypes");
  const mergedPhenotypes = {
    ...(existingReport?.phenotypes ?? {}),
    ...(payload.phenotypes ?? {}),
  };
  const mergedRawData: ReportFilePayload = {
    ...payload,
    phenotypes: mergedPhenotypes,
  };

  const savedReport = await Report.findByIdAndUpdate(
    reportId,
    {
      _id: reportId,
      sample: payload.sample,
      generalGraphs: payload.general_graphs ?? {},
      phenotypes: mergedPhenotypes,
      rawData: mergedRawData,
      uploadedAt: new Date(),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!savedReport) {
    throw new ApiError(500, "Failed to save report");
  }

  return {
    action: existingReport ? "updated" : "created",
    report: buildReportResponse(savedReport),
  };
};

const getReportById = async (reportId: string): Promise<ReportResponse> => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return buildReportResponse(report);
};

const getReportCategoriesById = async (reportId: string): Promise<ReportCategoriesResponse> => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return buildReportCategoriesResponse(report);
};

const getPhenotypeById = async (
  reportId: string,
  phenotypeId: string
): Promise<ReportPhenotypeResponse> => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  const phenotype = report.phenotypes?.[phenotypeId];

  if (!phenotype || typeof phenotype !== "object" || Array.isArray(phenotype)) {
    throw new ApiError(404, "Phenotype not found");
  }

  return buildReportPhenotypeResponse(
    report._id,
    phenotypeId,
    phenotype as ReportPhenotypeData
  );
};

const getPhenotypesByCategory = async (
  reportId: string,
  categoryName: string
): Promise<ReportCategoryPhenotypesResponse> => {
  const report = await Report.findById(reportId);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  const normalizedCategoryName = categoryName.trim().toLowerCase();
  const matchingPhenotypes: ReportCategoryPhenotypeItem[] = [];

  for (const [phenotypeId, phenotype] of Object.entries(report.phenotypes ?? {})) {
    if (!phenotype || typeof phenotype !== "object" || Array.isArray(phenotype)) {
      continue;
    }

    const phenotypeCategoryNames = getPhenotypeCategoryNames(phenotype);
    const hasMatchingCategory = phenotypeCategoryNames.some(
      (phenotypeCategoryName) => phenotypeCategoryName.toLowerCase() === normalizedCategoryName
    );

    if (!hasMatchingCategory) {
      continue;
    }

    matchingPhenotypes.push({
      phenotypeId,
      phenotype: phenotype as ReportPhenotypeData,
    });
  }

  if (matchingPhenotypes.length === 0) {
    throw new ApiError(404, "No phenotypes found for this category");
  }

  matchingPhenotypes.sort((first, second) => first.phenotypeId.localeCompare(second.phenotypeId));

  return buildReportCategoryPhenotypesResponse(
    report._id,
    categoryName.trim(),
    matchingPhenotypes
  );
};

export const reportService = {
  upsertReport,
  getReportById,
  getReportCategoriesById,
  getPhenotypeById,
  getPhenotypesByCategory,
};
