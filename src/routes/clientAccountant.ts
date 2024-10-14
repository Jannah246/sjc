import * as express from "express";
import {
  addAccountant,
  accountantStatusUpdate,
  getAllAccountants,
  getAssignCampByAccountant,
  getOneAccountant,
  updateAccountant,
} from "../controllers";
import {
  accountantValidator,
  checkMongooseId,
  getCampByAccountantValidator,
  isAccountantIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();
router.post(
  "/accountant",
  multer().array(""),
  [verifyClientToken, accountantValidator],
  addAccountant
);
router.post(
  "/accountant/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  accountantStatusUpdate
);
router.get(
  "/accountant",
  [verifyClientToken, statusValidator],
  getAllAccountants
);
router.get(
  "/accountant/assigned-camps-by-accountant",
  [verifyClientToken, getCampByAccountantValidator],
  getAssignCampByAccountant
);
router.get(
  "/accountant/:id",
  [verifyClientToken, checkMongooseId],
  getOneAccountant
);
router.put(
  "/accountant/:id",
  multer().array(""),
  [verifyClientToken, isAccountantIdIsExists, accountantValidator],
  updateAccountant
);

export default router;
