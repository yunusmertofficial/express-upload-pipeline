import multer from "multer";
import { RequestHandler } from "express";
import { UploadFieldConfig } from "./types";
import { generateFieldListFromArray } from "./generateFieldList";
import { generateFileFilter } from "./generateFileFilter";
import { validateFieldGroupFiles } from "./validateFieldGroupFiles";
import { parseArrayFieldDynamic } from "./parseArrayFieldDynamic";
import { getFieldPath } from "./utils";

export function setupUploadPipeline(
  config: UploadFieldConfig[]
): RequestHandler[] {
  const fields = config.flatMap(({ name, maxCount }) => {
    return maxCount === 1
      ? [{ name: getFieldPath(name), maxCount }]
      : generateFieldListFromArray({
          name,
          maxCount,
          allowedTypes: [],
          maxSizeMB: 0,
        });
  });

  const fileFilter = generateFileFilter(
    Object.fromEntries(
      config.map(({ name, allowedTypes }) => [name, allowedTypes])
    )
  );

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
  });

  const validateSizes = validateFieldGroupFiles(
    Object.fromEntries(
      config.map(({ name, allowedTypes, maxSizeMB }) => [
        name,
        { allowedTypes, maxSizeMB: maxSizeMB ?? 5 },
      ])
    )
  );

  const parsers = config
    .filter(({ maxCount }) => maxCount > 1)
    .map(({ name }) => parseArrayFieldDynamic(name));

  return [upload.fields(fields), validateSizes, ...parsers];
}
