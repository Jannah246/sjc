import * as express from "express";
import {
  adminLogin,
  getAdminDetails,
  getAllCampsClientWise,
  getCampsClientWise,
  getProfile,
  updatePassword,
} from "../controllers";
import {
  checkMongooseId,
  loginValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();

/**
 * Use middleware like auth, that should verify the token and if token is valid decode it and save all values into req.decodedToken
 * Then you can access token payload like, const decodedToke = req.decodedToken;
 * decodedToke.role, decodedToke.userId, etc...
 */

router.post("/login", multer().array(""), loginValidator, adminLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyToken, updatePasswordValidator],
  updatePassword
);
router.get("/profile", verifyToken, getProfile);
router.get("/details", verifyToken, getAdminDetails);
router.get("/camps/:id", [verifyToken, checkMongooseId], getCampsClientWise);
router.get("/clientWiseAllCamps", verifyToken, getAllCampsClientWise);

export default router;
