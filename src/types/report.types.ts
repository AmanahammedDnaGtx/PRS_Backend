import { HydratedDocument } from "mongoose";

export type ReportSample = {
  id: string;
  full_name?: string;
  gender?: string;
  report_date?: string;
  [key: string]: unknown;
};

export type ReportFilePayload = {
  sample: ReportSample;
  general_graphs?: Record<string, unknown>;
  phenotypes?: Record<string, unknown>;
  [key: string]: unknown;
};

export interface IReport {
  _id: string;
  sample: ReportSample;
  generalGraphs: Record<string, unknown>;
  phenotypes: Record<string, unknown>;
  rawData: ReportFilePayload;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportDocument = HydratedDocument<IReport>;

export type ReportResponse = {
  id: string;
  sample: ReportSample;
  phenotypeCount: number;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  rawData: ReportFilePayload;
};

export type ReportCategory = {
  name: string;
  traitCount: number;
  riskLevels: Array<{
    name: string;
    count: number;
  }>;
};

export type ReportCategoriesResponse = {
  reportId: string;
  totalCategories: number;
  categories: ReportCategory[];
};

export type ReportPhenotypeData = Record<string, unknown>;

export type ReportPhenotypeResponse = {
  reportId: string;
  phenotypeId: string;
  phenotype: ReportPhenotypeData;
};

export type ReportCategoryPhenotypeItem = {
  phenotypeId: string;
  phenotype: ReportPhenotypeData;
};

export type ReportCategoryPhenotypesResponse = {
  reportId: string;
  categoryName: string;
  totalPhenotypes: number;
  phenotypes: ReportCategoryPhenotypeItem[];
};
