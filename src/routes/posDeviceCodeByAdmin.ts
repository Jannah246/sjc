import * as express from "express";
import {
  addDeviceCode,
  getAllDeviceCodes,
  getOneDeviceCode,
  posDeviceCodeStatusUpdate,
} from "../controllers";
import {
  addDeviceCodeValidator,
  checkMongooseId,
  statusUpdateValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/pos-device-code",
  multer().array(""),
  [verifyToken, addDeviceCodeValidator],
  addDeviceCode
);
router.get("/pos-device-code", [verifyToken], getAllDeviceCodes);
router.get(
  "/pos-device-code/:id",
  [verifyToken, checkMongooseId],
  getOneDeviceCode
);
router.post(
  "/pos-device-code/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  posDeviceCodeStatusUpdate
);

export default router;
