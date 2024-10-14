import * as express from "express";
import {
  addInvestor,
  getAllInvestors,
  getOneInvestor,
  investorStatusUpdate,
  updateInvestor,
} from "../controllers";
import {
  addInvestorValidator,
  checkMongooseId,
  isInvestorIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();
router.post(
  "/investors",
  multer().array(""),
  [verifyClientToken, addInvestorValidator],
  addInvestor
);
router.put(
  "/investors/:id",
  multer().array(""),
  [verifyClientToken, isInvestorIdIsExists, addInvestorValidator],
  updateInvestor
);
router.post(
  "/investors/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  investorStatusUpdate
);
router.get("/investors", [verifyClientToken, statusValidator], getAllInvestors);
router.get(
  "/investors/:id",
  [verifyClientToken, checkMongooseId],
  getOneInvestor
);

export default router;
