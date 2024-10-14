import * as express from "express";
import {
  addCoordinator,
  coordinatorStatusUpdate,
  getAllCoordinators,
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
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/coordinator",
  multer().array(""),
  [verifyToken, coordinatorValidator],
  addCoordinator
);
router.put(
  "/coordinator/:id",
  multer().array(""),
  [verifyToken, isCoordinatorIdIsExists, coordinatorValidator],
  updateCoordinator
);
router.post(
  "/coordinator/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  coordinatorStatusUpdate
);
router.get("/coordinator", [verifyToken, statusValidator], getAllCoordinators);
router.get(
  "/coordinator/:id",
  [verifyToken, checkMongooseId],
  getOneCoordinator
);

export default router;
