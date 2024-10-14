import * as express from "express";
import {
  accountantLogin,
  getAccountantDetails,
  getAccountantProfile,
  getInternetPackageOrderAccountantWise,
  updateAccountantPassword,
} from "../controllers";
import {
  loginValidator,
  orderStatusValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyAccountantToken } from "../middlewares/auth/accountant";
import multer from "multer";

const router = express.Router();

router.post("/login", multer().array(""), loginValidator, accountantLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyAccountantToken, updatePasswordValidator],
  updateAccountantPassword
);
router.get("/profile", verifyAccountantToken, getAccountantProfile);
router.get("/details", verifyAccountantToken, getAccountantDetails);
router.get(
  "/internet-package/order",
  [verifyAccountantToken, orderStatusValidator],
  getInternetPackageOrderAccountantWise
);

export default router;
