import * as express from "express";
import {
  addNationalType,
  getAllNationalTypes,
  getOneNationalType,
  nationalTypeStatusUpdate,
  updateNationalType,
} from "../controllers";
import {
  addNationalTypeValidator,
  checkMongooseId,
  isNationalTypeIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/national-type",
  multer().array(""),
  [verifyToken, addNationalTypeValidator],
  addNationalType
);
router.put(
  "/national-type/:id",
  multer().array(""),
  [verifyToken, isNationalTypeIdIsExists, addNationalTypeValidator],
  updateNationalType
);
router.post(
  "/national-type/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  nationalTypeStatusUpdate
);
router.get(
  "/national-type",
  [verifyToken, statusValidator],
  getAllNationalTypes
);
router.get(
  "/national-type/:id",
  [verifyToken, checkMongooseId],
  getOneNationalType
);

export default router;
