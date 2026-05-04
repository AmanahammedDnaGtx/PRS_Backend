import { Schema, model } from "mongoose";

import { IReport } from "../types/report.types";

const reportSchema = new Schema<IReport>(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    sample: {
      type: Schema.Types.Mixed,
      required: true,
    },
    generalGraphs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    phenotypes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    rawData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "Reports",
  }
);

export const Report = model<IReport>("Report", reportSchema);
