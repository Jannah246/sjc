import * as express from "express";

import { verifyClientToken } from "../middlewares/auth/client";
import {
  assignCampsValidator,
  assignedCampsListClientPackageValidator,
  assignedPackageListCampWiseValidator,
  checkMongooseId,
  internetPackageClientValidator,
  isInternetPackageClientIdIsExists,
  statusUpdateValidator,
  statusValidator,
} from "../middlewares/validators";
import {
  addInternetPackageClient,
  assignCamps,
  assignedCampsListClientPackage,
  assignedPackageList,
  assignedPackageListCampWise,
  getAllInternetPackagesClient,
  getOneInternetPackageClient,
  internetPackageStatusClientUpdate,
  updateInternetPackageClient,
} from "../controllers";
import multer from "multer";

const router = express.Router();
router.get(
  "/internet-package/assigned",
  [verifyClientToken, statusValidator],
  assignedPackageList
);
router.post(
  "/internet-package",
  multer().array(""),
  [verifyClientToken, internetPackageClientValidator],
  addInternetPackageClient
);
router.put(
  "/internet-package/:id",
  multer().array(""),
  [
    verifyClientToken,
    isInternetPackageClientIdIsExists,
    internetPackageClientValidator,
  ],
  updateInternetPackageClient
);
router.post(
  "/internet-package/status-update/:id",
  multer().array(""),
  [verifyClientToken, checkMongooseId, statusUpdateValidator],
  internetPackageStatusClientUpdate
);
router.get(
  "/internet-package",
  [verifyClientToken, statusValidator],
  getAllInternetPackagesClient
);
router.get(
  "/internet-package/assigned-package-camp-wise",
  [verifyClientToken, assignedPackageListCampWiseValidator],
  assignedPackageListCampWise
);
router.get(
  "/internet-package/assigned-camps-by-client-package",
  [verifyClientToken, assignedCampsListClientPackageValidator],
  assignedCampsListClientPackage
);
router.get(
  "/internet-package/:id",
  [verifyClientToken, checkMongooseId],
  getOneInternetPackageClient
);
router.post(
  "/internet-package/assign-camps",
  multer().array(""),
  [verifyClientToken, assignCampsValidator],
  assignCamps
);

export default router;
