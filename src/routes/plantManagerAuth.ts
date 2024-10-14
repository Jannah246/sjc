import * as express from "express";
import {
  getPlantManagerProfile,
  plantManagerLogin,
  updatePlantManagerPassword,
} from "../controllers";
import {
  loginValidator,
  updatePasswordValidator,
} from "../middlewares/validators";
import { verifyPlantManagerToken } from "../middlewares/auth/plantManager";
import multer from "multer";

const router = express.Router();

router.post("/login", multer().array(""), loginValidator, plantManagerLogin);
router.post(
  "/update-password",
  multer().array(""),
  [verifyPlantManagerToken, updatePasswordValidator],
  updatePlantManagerPassword
);
router.get("/profile", verifyPlantManagerToken, getPlantManagerProfile);

export default router;
