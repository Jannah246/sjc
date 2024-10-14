import * as express from "express";
import {
  addPos,
  getAllPos,
  getOnePos,
  posStatusUpdate,
  updatePos,
} from "../controllers";
import {
  checkMongooseId,
  isPosIdIsExists,
  posValidator,
  statusUpdateValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();
router.post(
  "/pos",
  multer().array(""),
  [verifyClientToken, posValidator],
  addPos
);
router.put(
  "/pos/:id",
  multer().array(""),
  [verifyClientToken, isPosIdIsExists, posValidator],
  updatePos
);
router.post(
  "/pos/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  posStatusUpdate
);
router.get("/pos", [verifyClientToken], getAllPos);
router.get("/pos/:id", [verifyClientToken, checkMongooseId], getOnePos);

export default router;
