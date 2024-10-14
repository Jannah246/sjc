import * as express from "express";
import {
  addAccountant,
  accountantStatusUpdate,
  getAllAccountants,
  getOneAccountant,
  updateAccountant,
} from "../controllers";
import {
  accountantValidator,
  checkMongooseId,
  isAccountantIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/accountant",
  multer().array(""),
  [verifyToken, accountantValidator],
  addAccountant
);
router.put(
  "/accountant/:id",
  multer().array(""),
  [verifyToken, isAccountantIdIsExists, accountantValidator],
  updateAccountant
);
router.post(
  "/accountant/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  accountantStatusUpdate
);
router.get("/accountant", [verifyToken, statusValidator], getAllAccountants);
router.get("/accountant/:id", [verifyToken, checkMongooseId], getOneAccountant);

export default router;
