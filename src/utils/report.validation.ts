import { z } from "zod";

export const reportFileSchema = z
  .object({
    sample: z
      .object({
        id: z.string().trim().min(1, "sample.id is required"),
        full_name: z.string().trim().optional(),
        gender: z.string().trim().optional(),
        report_date: z.string().trim().optional(),
      })
      .passthrough(),
    general_graphs: z.record(z.unknown()).optional(),
    phenotypes: z.record(z.unknown()).optional(),
  })
  .passthrough();

export const reportIdParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    reportId: z.string().trim().min(1, "reportId is required"),
  }),
  query: z.object({}).optional(),
});

export const reportPhenotypeParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    reportId: z.string().trim().min(1, "reportId is required"),
    phenotypeId: z.string().trim().min(1, "phenotypeId is required"),
  }),
  query: z.object({}).optional(),
});

export const reportCategoryPhenotypesParamsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    reportId: z.string().trim().min(1, "reportId is required"),
    categoryName: z.string().trim().min(1, "categoryName is required"),
  }),
  query: z.object({}).optional(),
});
