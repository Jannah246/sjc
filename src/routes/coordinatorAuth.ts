import * as express from "express";
import {
  coordinatorLogin,
  getCoordinatorDetails,
  getCoordinatorProfile,
  getInternetPackageOrderCoordinatorWise,
  updateCoordinatorPassword,
} from "../controllers";
import {
  loginValidator,
  orderStatusValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyCoordinatorToken } from "../middlewares/auth/coordinator";
import multer from "multer";

const router = express.Router();

router.post("/login", multer().array(""), loginValidator, coordinatorLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyCoordinatorToken, updatePasswordValidator],
  updateCoordinatorPassword
);
router.get("/profile", verifyCoordinatorToken, getCoordinatorProfile);
router.get("/details", verifyCoordinatorToken, getCoordinatorDetails);
router.get(
  "/internet-package/order",
  [verifyCoordinatorToken, orderStatusValidator],
  getInternetPackageOrderCoordinatorWise
);

export default router;
