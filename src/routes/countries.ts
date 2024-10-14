import * as express from "express";
import {
  addCountry,
  countryStatusUpdate,
  getAllCountries,
  getOneCountry,
  updateCountry,
} from "../controllers";
import {
  addCountryValidator,
  checkMongooseId,
  isCountryIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/country",
  multer().array(""),
  [verifyToken, addCountryValidator],
  addCountry
);
router.put(
  "/country/:id",
  multer().array(""),
  [verifyToken, isCountryIdIsExists, addCountryValidator],
  updateCountry
);
router.post(
  "/country/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  countryStatusUpdate
);
router.get("/country", [verifyToken, statusValidator], getAllCountries);
router.get("/country/:id", [verifyToken, checkMongooseId], getOneCountry);

export default router;
