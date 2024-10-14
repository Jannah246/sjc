import * as express from "express";
import {
  addInternetPackage,
  assignClients,
  assignedClientsListPackageWise,
  assignedPackageListClientWise,
  getAllInternetPackages,
  getOneInternetPackage,
  internetPackageStatusUpdate,
  updateInternetPackage,
} from "../controllers";
import {
  assignClientValidator,
  assignedClientsListPackageWiseValidator,
  assignedPackageListClientWiseValidator,
  checkMongooseId,
  internetPackageValidator,
  isInternetPackageIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/internet-package",
  multer().array(""),
  [verifyToken, internetPackageValidator],
  addInternetPackage
);
router.put(
  "/internet-package/:id",
  multer().array(""),
  [verifyToken, isInternetPackageIdIsExists, internetPackageValidator],
  updateInternetPackage
);
router.post(
  "/internet-package/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  internetPackageStatusUpdate
);
router.get(
  "/internet-package",
  [verifyToken, statusValidator],
  getAllInternetPackages
);
router.get(
  "/internet-package/assigned-packages-by-clients",
  [verifyToken, assignedPackageListClientWiseValidator],
  assignedPackageListClientWise
);
router.get(
  "/internet-package/assigned-clients-by-package",
  [verifyToken, assignedClientsListPackageWiseValidator],
  assignedClientsListPackageWise
);
router.get(
  "/internet-package/:id",
  [verifyToken, checkMongooseId],
  getOneInternetPackage
);
router.post(
  "/internet-package/assign-client",
  multer().array(""),
  [verifyToken, assignClientValidator],
  assignClients
);

export default router;
