import { Request, Response, NextFunction } from "express";

export function parseArrayFieldDynamic(fieldPrefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const body = req.body;
    const items: Record<string, any>[] = [];

    // Tüm body key'lerini tara
    for (const key in body) {
      const match = key.match(
        new RegExp(`^${fieldPrefix}\\[(\\d+)\\]\\.([^\\.]+)$`)
      );
      if (!match) continue;

      const index = Number(match[1]);
      const prop = match[2];

      if (!items[index]) items[index] = {};
      items[index][prop] = body[key];
    }

    // Dosyaları ekle
    for (const key in files) {
      const match = key.match(
        new RegExp(`^${fieldPrefix}\\[(\\d+)\\]\\.file$`)
      );
      if (!match) continue;

      const index = Number(match[1]);
      if (!items[index]) items[index] = {};
      items[index]["file"] = files[key][0]; // tek dosya
    }

    (req as any).parsedFiles = {
      ...((req as any).parsedFiles || {}),
      [fieldPrefix]: items,
    };

    next();
  };
}
