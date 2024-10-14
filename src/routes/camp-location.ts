import * as express from "express";
import { getLocationWiseCamp } from "../controllers";
import { locationStatusValidator } from "../middlewares/validators";

const router = express.Router();
router.get("/get-by-location", locationStatusValidator, getLocationWiseCamp);

export default router;
