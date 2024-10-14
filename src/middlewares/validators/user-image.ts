import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import {
  IMAGE_SUPPORTED_FORMATS,
  formatResponse,
  userDir,
} from "../../helpers";

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (!IMAGE_SUPPORTED_FORMATS.includes(file.mimetype)) {
    return callback(new Error("Only images allowed"));
  }

  callback(null, true);
};

const storageEngine = multer.diskStorage({
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) {
    callback(null, userDir);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadHandler = multer({
  storage: storageEngine,
  fileFilter: fileFilter,
}).fields([
  { name: "national_id", maxCount: 1 },
  { name: "user_image", maxCount: 1 },
  { name: "passport_image", maxCount: 1 },
]);

export const imageValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  uploadHandler(req, res, function (err: any) {
    if (err instanceof multer.MulterError) {
      const data = formatResponse(400, true, err.message, null);
      res.status(400).json(data);
      return;
    } else if (err instanceof Error) {
      const data = formatResponse(400, true, err.message, null);
      res.status(400).json(data);
      return;
    }
    next();
  });
};
