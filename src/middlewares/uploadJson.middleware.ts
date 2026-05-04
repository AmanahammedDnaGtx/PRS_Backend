import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

import { ApiError } from "../utils/ApiError";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (
    _request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    const isJsonMimeType = ["application/json", "text/json"].includes(file.mimetype);
    const isJsonFileName = file.originalname.toLowerCase().endsWith(".json");

    if (isJsonMimeType || isJsonFileName) {
      callback(null, true);
      return;
    }

    callback(new ApiError(400, "Only .json files are allowed"));
  },
});

export const uploadSingleJsonFile = upload.single("file");
