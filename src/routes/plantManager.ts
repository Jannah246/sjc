import * as express from "express";
import {
  addPlantManager,
  getAllPlantManagers,
  getPlantManager,
  plantManagerStatusUpdate,
  updatePlantManager,
} from "../controllers";
import {
  checkMongooseId,
  isPlantMangerIdIsExists,
  plantManagerValidator,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/plant-manager",
  multer().array(""),
  [verifyToken, plantManagerValidator],
  addPlantManager
);
router.put(
  "/plant-manager/:id",
  multer().array(""),
  [verifyToken, isPlantMangerIdIsExists, plantManagerValidator],
  updatePlantManager
);
router.post(
  "/plant-manager/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  plantManagerStatusUpdate
);
router.get(
  "/plant-manager",
  [verifyToken, statusValidator],
  getAllPlantManagers
);
router.get(
  "/plant-manager/:id",
  [verifyToken, checkMongooseId],
  getPlantManager
);

export default router;
