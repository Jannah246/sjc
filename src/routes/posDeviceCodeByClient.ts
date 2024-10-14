import * as express from "express";
import {
  addDeviceCodeHistory,
  assignDeviceCodeToCamps,
  assignDeviceCodeToPos,
  deActiveDeviceCode,
  getAllDeviceCodesByClient,
} from "../controllers";
import {
  assignDeviceCodeToCampsValidator,
  assignDeviceCodeToPosValidator,
  deActiveDeviceCodeValidator,
  deviceCodeHistoryValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();
router.post(
  "/pos-device-code/activation",
  multer().array(""),
  [verifyClientToken, deviceCodeHistoryValidator],
  addDeviceCodeHistory
);
router.post(
  "/pos-device-code/deactivation",
  multer().array(""),
  [verifyClientToken, deActiveDeviceCodeValidator],
  deActiveDeviceCode
);
router.get("/pos-device-code", [verifyClientToken], getAllDeviceCodesByClient);
router.post(
  "/pos-device-code/assign-camps",
  multer().array(""),
  [verifyClientToken, assignDeviceCodeToCampsValidator],
  assignDeviceCodeToCamps
);
router.post(
  "/pos-device-code/assign-pos",
  multer().array(""),
  [verifyClientToken, assignDeviceCodeToPosValidator],
  assignDeviceCodeToPos
);

export default router;
