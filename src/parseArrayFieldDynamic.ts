import { Request, Response, NextFunction } from "express";

export function parseArrayFieldDynamic(fieldPrefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [key: string]: Express.Multer.File[] };
    const body = req.body;
    const regex = new RegExp(`^${fieldPrefix}\\[(\\d+)\\]\\.file$`);
    const items: any[] = [];

    const matchedIndexes = Object.keys(files)
      .map((key) => {
        const match = key.match(regex);
        return match ? Number(match[1]) : null;
      })
      .filter((n): n is number => n !== null);

    for (const i of matchedIndexes) {
      const id = body?.[`${fieldPrefix}[${i}].id`];
      const file = files?.[`${fieldPrefix}[${i}].file`]?.[0];
      items.push({ id: id ? Number(id) : undefined, file });
    }

    (req as any).parsedFiles = {
      ...((req as any).parsedFiles || {}),
      [fieldPrefix]: items,
    };

    next();
  };
}
