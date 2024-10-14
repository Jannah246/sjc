import * as express from "express";
import {
  clientLogin,
  getClientDetails,
  getClientProfile,
  getInternetPackageOrderClientWise,
  updateClientPassword,
} from "../controllers";
import {
  loginValidator,
  orderStatusValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();

router.post("/login", multer().array(""), loginValidator, clientLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyClientToken, updatePasswordValidator],
  updateClientPassword
);
router.get("/profile", verifyClientToken, getClientProfile);
router.get("/details", verifyClientToken, getClientDetails);
router.get(
  "/internet-package/order",
  [verifyClientToken, orderStatusValidator],
  getInternetPackageOrderClientWise
);

export default router;
