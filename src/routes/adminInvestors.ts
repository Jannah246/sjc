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
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/investors",
  multer().array(""),
  [verifyToken, addInvestorValidator],
  addInvestor
);
router.put(
  "/investors/:id",
  multer().array(""),
  [verifyToken, isInvestorIdIsExists, addInvestorValidator],
  updateInvestor
);
router.post(
  "/investors/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  investorStatusUpdate
);
router.get("/investors", [verifyToken, statusValidator], getAllInvestors);
router.get("/investors/:id", [verifyToken, checkMongooseId], getOneInvestor);

export default router;
