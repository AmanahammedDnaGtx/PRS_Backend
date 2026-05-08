import { Express } from "express";

import { ApiError } from "../utils/ApiError";
import { reportFileSchema } from "../utils/report.validation";
import {
  ReportCategoriesResponse,
  ReportCategoryPhenotypesResponse,
  ReportDocument,
  ReportFilePayload,
  ReportCategoryPhenotypeItem,
  ReportPhenotypeData,
  ReportPhenotypeResponse,
  ReportResponse,
} from "../types/report.types";

export const parseUploadedReportFile = (file: Express.Multer.File): ReportFilePayload => {
  try {
    const parsedJson = JSON.parse(file.buffer.toString("utf-8")) as unknown;
    return reportFileSchema.parse(parsedJson);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      throw new ApiError(400, "Uploaded file must contain valid JSON");
    }

    throw error;
  }
};

export const buildReportResponse = (report: ReportDocument): ReportResponse => {
  return {
    id: report._id,
    sample: report.sample,
    phenotypeCount: Object.keys(report.phenotypes ?? {}).length,
    uploadedAt: report.uploadedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    rawData: report.rawData,
  };
};

const normalizeCategoryNames = (categoryValue: unknown): string[] => {
  const categoryNames: string[] = [];
  const seenCategoryNames = new Set<string>();
  const categoryValues = Array.isArray(categoryValue)
    ? categoryValue
    : [categoryValue];

  for (const categoryValueItem of categoryValues) {
    if (typeof categoryValueItem !== "string") {
      continue;
    }

    for (const categoryName of categoryValueItem.split(",")) {
      const trimmedCategoryName = categoryName.trim();

      if (!trimmedCategoryName) {
        continue;
      }

      const normalizedCategoryName = trimmedCategoryName.toLowerCase();

      if (seenCategoryNames.has(normalizedCategoryName)) {
        continue;
      }

      seenCategoryNames.add(normalizedCategoryName);
      categoryNames.push(trimmedCategoryName);
    }
  }

  return categoryNames;
};

export const getPhenotypeCategoryNames = (phenotype: unknown): string[] => {
  if (!phenotype || typeof phenotype !== "object") {
    return [];
  }

  if ("category_en" in phenotype) {
    const categoryNames = normalizeCategoryNames(phenotype.category_en);

    if (categoryNames.length > 0) {
      return categoryNames;
    }
  }

  if ("category" in phenotype) {
    return normalizeCategoryNames(phenotype.category);
  }

  return [];
};

const getPhenotypeRiskLevelName = (phenotype: unknown): string | null => {
  if (!phenotype || typeof phenotype !== "object") {
    return null;
  }

  if ("risk_level" in phenotype && typeof phenotype.risk_level === "string") {
    return phenotype.risk_level.trim();
  }

  if ("riskLevel" in phenotype && typeof phenotype.riskLevel === "string") {
    return phenotype.riskLevel.trim();
  }

  return null;
};

export const buildReportCategoriesResponse = (
  report: ReportDocument
): ReportCategoriesResponse => {
  const categoryMap = new Map<
    string,
    {
      name: string;
      traitCount: number;
      riskLevelMap: Map<string, number>;
    }
  >();

  for (const phenotype of Object.values(report.phenotypes ?? {})) {
    const categoryNames = getPhenotypeCategoryNames(phenotype);

    if (categoryNames.length === 0) {
      continue;
    }

    const riskLevelName = getPhenotypeRiskLevelName(phenotype) ?? "Unknown";

    for (const categoryName of categoryNames) {
      const normalizedCategoryName = categoryName.toLowerCase();
      const existingCategory = categoryMap.get(normalizedCategoryName);

      if (existingCategory) {
        existingCategory.traitCount += 1;
        existingCategory.riskLevelMap.set(
          riskLevelName,
          (existingCategory.riskLevelMap.get(riskLevelName) ?? 0) + 1
        );
        continue;
      }

      categoryMap.set(normalizedCategoryName, {
        name: categoryName,
        traitCount: 1,
        riskLevelMap: new Map([[riskLevelName, 1]]),
      });
    }
  }

  const categories = Array.from(categoryMap.values())
    .map((category) => ({
      name: category.name,
      traitCount: category.traitCount,
      riskLevels: Array.from(category.riskLevelMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((first, second) => first.name.localeCompare(second.name)),
    }))
    .sort((first, second) => first.name.localeCompare(second.name));

  return {
    reportId: report._id,
    totalCategories: categories.length,
    categories,
  };
};

export const buildReportPhenotypeResponse = (
  reportId: string,
  phenotypeId: string,
  phenotype: ReportPhenotypeData
): ReportPhenotypeResponse => {
  return {
    reportId,
    phenotypeId,
    phenotype,
  };
};

export const buildReportCategoryPhenotypesResponse = (
  reportId: string,
  categoryName: string,
  phenotypes: ReportCategoryPhenotypeItem[]
): ReportCategoryPhenotypesResponse => {
  return {
    reportId,
    categoryName,
    totalPhenotypes: phenotypes.length,
    phenotypes,
  };
};
