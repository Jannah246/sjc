import * as express from "express";
import {
  addClient,
  getAllClients,
  getOneClient,
  statusUpdate,
  updateClient,
} from "../controllers";
import {
  statusUpdateValidator,
  ClientValidator,
  checkMongooseId,
  isClientIdIsExists,
} from "../middlewares/validators";
import { verifyToken } from "../middlewares/auth/admin";
import multer from "multer";

const router = express.Router();
router.post(
  "/client-admin",
  multer().array(""),
  [verifyToken, ClientValidator],
  addClient
);
router.put(
  "/client-admin/:id",
  multer().array(""),
  [verifyToken, isClientIdIsExists, ClientValidator],
  updateClient
);
router.post(
  "/client-admin/status-update/:id",
  multer().array(""),
  [verifyToken, checkMongooseId, statusUpdateValidator],
  statusUpdate
);
router.get("/client-admin", [verifyToken], getAllClients);
router.get("/client-admin/:id", [verifyToken, checkMongooseId], getOneClient);

export default router;
