import * as express from "express";
import {
  getInvestorProfile,
  investorLogin,
  updateInvestorPassword,
} from "../controllers";
import {
  loginValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyInvestorToken } from "../middlewares/auth/investors";
import multer from "multer";

const router = express.Router();

router.post("/login", multer().array(""), loginValidator, investorLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyInvestorToken, updatePasswordValidator],
  updateInvestorPassword
);
router.get("/profile", verifyInvestorToken, getInvestorProfile);

export default router;
