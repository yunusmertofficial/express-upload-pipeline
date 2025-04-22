import { Request, Response, NextFunction } from "express";

export function validateFieldGroupFiles(rules: {
  [fieldPrefix: string]: { allowedTypes: string[]; maxSizeMB: number };
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [key: string]: Express.Multer.File[] };

    for (const prefix in rules) {
      const rule = rules[prefix];

      const matchingFields = Object.keys(files).filter(
        (key) => key === `${prefix}.file` || key.startsWith(`${prefix}[`)
      );

      for (const key of matchingFields) {
        for (const file of files[key]) {
          if (!rule.allowedTypes.includes(file.mimetype)) {
            return res
              .status(400)
              .json({ error: `${key}: Geçersiz dosya tipi` });
          }
          if (file.size > rule.maxSizeMB * 1024 * 1024) {
            return res
              .status(400)
              .json({ error: `${key}: Dosya boyutu çok büyük` });
          }
        }
      }
    }

    next();
  };
}
