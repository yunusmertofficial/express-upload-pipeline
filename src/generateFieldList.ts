import { UploadFieldConfig } from "./types";
import { getFieldPath } from "./utils";

export function generateFieldListFromArray({
  name,
  maxCount,
}: UploadFieldConfig) {
  return Array.from({ length: maxCount }, (_, i) => ({
    name: getFieldPath(name, i),
    maxCount: 1,
  }));
}
