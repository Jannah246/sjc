import * as express from "express";
import {
  addCamp,
  assignAccountantToCamps,
  assignCampsToAccountant,
  assignCampsToCoordinator,
  assignCampsToPos,
  campStatusUpdate,
  getAllCamps,
  getAssignAccountant,
  getAssignCoordinator,
  getAssignPos,
  getAssignPosDevice,
  getBaseCampUser,
  getOneCamp,
  updateCamp,
} from "../controllers";
import {
  assignAccountantToCampValidator,
  assignCampToAccountantValidator,
  assignCampToCoordinatorValidator,
  assignCampToPosValidator,
  baseCampUserValidator,
  campValidator,
  checkMongooseId,
  getAssignByCampValidator,
  isCampIdIsExists,
  statusUpdateValidator,
} from "../middlewares/validators";
import { verifyClientToken } from "../middlewares/auth/client";
import multer from "multer";

const router = express.Router();
router.post(
  "/camps",
  multer().array(""),
  [verifyClientToken, campValidator],
  addCamp
);
router.post(
  "/camps/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  campStatusUpdate
);
router.get("/camps", [verifyClientToken], getAllCamps);
router.post(
  "/camps/assign/pos",
  multer().array(""),
  [verifyClientToken, assignCampToPosValidator],
  assignCampsToPos
);
router.post(
  "/camps/assign-camps-to-coordinator",
  multer().array(""),
  [verifyClientToken, assignCampToCoordinatorValidator],
  assignCampsToCoordinator
);
router.post(
  "/camps/assign-camps-to-accountant",
  multer().array(""),
  [verifyClientToken, assignCampToAccountantValidator],
  assignCampsToAccountant
);
router.post(
  "/camps/assign/accountant",
  multer().array(""),
  [verifyClientToken, assignAccountantToCampValidator],
  assignAccountantToCamps
);
router.get(
  "/camps/assigned-coordinators-by-camp",
  [verifyClientToken, getAssignByCampValidator],
  getAssignCoordinator
);
router.get(
  "/camps/assigned-accountants-by-camp",
  [verifyClientToken, getAssignByCampValidator],
  getAssignAccountant
);
router.get(
  "/camps/assigned-pos-by-camp",
  [verifyClientToken, getAssignByCampValidator],
  getAssignPos
);
router.get(
  "/camps/base-camp-users",
  [verifyClientToken, baseCampUserValidator],
  getBaseCampUser
);
router.get("/camps/:id", [verifyClientToken, checkMongooseId], getOneCamp);
router.put(
  "/camps/:id",
  multer().array(""),
  [verifyClientToken, isCampIdIsExists, campValidator],
  updateCamp
);
router.get(
  "/camps/assigned-pos-device-code/:id",
  [verifyClientToken, checkMongooseId],
  getAssignPosDevice
);

export default router;
