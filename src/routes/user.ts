import * as express from "express";

import multer from "multer";
import {
  assignUserToCamp,
  assignedPackageListCampWise,
  changeUserPhone,
  changeUserToCamp,
  getAllCountries,
  getAllNationalTypes,
  getBaseCamp,
  getClientWiseCamp,
  getInternetPackageListForEndUser,
  getInternetPackageOrderById,
  getInternetPackageOrderListForEndUser,
  getOneCamp,
  getRechargeHistory,
  getUserProfile,
  manualActivePackage,
  newUserPhoneVerify,
  sendUserOtp,
  updateProfile,
  userPlaceInternetOrder,
  verifyUserOtp,
} from "../controllers";
import {
  assignUserToCampValidator,
  checkMongooseId,
  assignedPackageListCampWiseValidator,
  imageValidator,
  updateProfileValidator,
  userChangePhoneValidator,
  userSendOtpValidator,
  userVerificationNewPhoneValidator,
  userVerifyOtpValidator,
  manualActivePackageValidator,
  userPlaceOrderValidator,
  orderStatusValidator,
} from "../middlewares/validators";
import { verifyUserToken } from "../middlewares/auth/user";
import { validateCamp } from "../controllers/endUser/validate-camp";
import { validateCampValidator } from "../middlewares/validators/validate-camp";

const router = express.Router();
router.post("/send-otp", multer().array(""), userSendOtpValidator, sendUserOtp);
router.post(
  "/otp-verification",
  multer().array(""),
  userVerifyOtpValidator,
  verifyUserOtp
);
router.post(
  "/profile-update",
  [verifyUserToken, imageValidator, updateProfileValidator],
  updateProfile
);
router.get("/national-type", verifyUserToken, getAllNationalTypes);
router.get("/country", verifyUserToken, getAllCountries);
router.get("/profile", verifyUserToken, getUserProfile);
router.get("/camps/get-base-camp", verifyUserToken, getBaseCamp);
router.post(
  "/validate-camp",
  multer().array(""),
  verifyUserToken,
  validateCampValidator,
  validateCamp
);
router.post(
  "/update-mobile-number",
  multer().array(""),
  [verifyUserToken, userChangePhoneValidator],
  changeUserPhone
);
router.post(
  "/otp-verification-new-number",
  multer().array(""),
  [verifyUserToken, userVerificationNewPhoneValidator],
  newUserPhoneVerify
);
router.post(
  "/camps/assign-user-camp",
  multer().array(""),
  [verifyUserToken, assignUserToCampValidator],
  assignUserToCamp
);
router.post(
  "/camps/change-user-camp",
  multer().array(""),
  [verifyUserToken, assignUserToCampValidator],
  changeUserToCamp
);
router.post(
  "/internet-package/manual-active",
  multer().array(""),
  [verifyUserToken, manualActivePackageValidator],
  manualActivePackage
);
router.post(
  "/internet-package/place-order",
  multer().array(""),
  [verifyUserToken, userPlaceOrderValidator],
  userPlaceInternetOrder
);
router.get(
  "/internet-package/order",
  [verifyUserToken, orderStatusValidator],
  getInternetPackageOrderListForEndUser
);
router.get("/recharge-history", verifyUserToken, getRechargeHistory);
router.get(
  "/internet-package/assigned-package-camp-wise",
  [verifyUserToken, assignedPackageListCampWiseValidator],
  assignedPackageListCampWise
);
router.get(
  "/camps/packages/internet",
  [verifyUserToken],
  getInternetPackageListForEndUser
);
router.get("/camps/get-client-wise-camp", verifyUserToken, getClientWiseCamp);
router.get("/camps/:id", [verifyUserToken, checkMongooseId], getOneCamp);
router.get(
  "/internet-package/order/:id",
  [verifyUserToken, checkMongooseId],
  getInternetPackageOrderById
);

export default router;
