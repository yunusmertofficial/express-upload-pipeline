import { Options } from "multer";

export function generateFileFilter(rules: {
  [fieldPrefix: string]: string[];
}): Options["fileFilter"] {
  return (req, file, cb) => {
    const field = file.fieldname;
    const prefix = Object.keys(rules).find(
      (p) => field === `${p}.file` || field.startsWith(`${p}[`)
    );

    if (!prefix || !rules[prefix].includes(file.mimetype)) {
      return cb(new Error(`${field}: Geçersiz dosya türü (${file.mimetype})`));
    }

    cb(null, true);
  };
}
