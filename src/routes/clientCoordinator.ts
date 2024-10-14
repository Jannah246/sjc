import * as express from "express";
import {
  addCoordinator,
  coordinatorStatusUpdate,
  getAllCoordinators,
  getAssignCampByCoordinator,
  getOneCoordinator,
  updateCoordinator,
} from "../controllers";
import {
  coordinatorValidator,
  checkMongooseId,
  isCoordinatorIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import multer from "multer";
import { verifyClientToken } from "../middlewares/auth/client";

const router = express.Router();
router.post(
  "/coordinator",
  multer().array(""),
  [verifyClientToken, coordinatorValidator],
  addCoordinator
);
router.put(
  "/coordinator/:id",
  multer().array(""),
  [verifyClientToken, isCoordinatorIdIsExists, coordinatorValidator],
  updateCoordinator
);
router.post(
  "/coordinator/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  coordinatorStatusUpdate
);
router.get(
  "/coordinator",
  [verifyClientToken, statusValidator],
  getAllCoordinators
);
router.get(
  "/coordinator/assigned-camps-by-coordinator",
  [verifyClientToken, isCoordinatorIdIsExists],
  getAssignCampByCoordinator
);
router.get(
  "/coordinator/:id",
  [verifyClientToken, checkMongooseId],
  getOneCoordinator
);

export default router;
