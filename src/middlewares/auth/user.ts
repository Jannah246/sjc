const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

import { Message, createObjectId, formatResponse } from "../../helpers";
import { authConfig } from "../../config/auth.config";
import {
  clientService,
  userCampService,
  userRegisterService,
} from "../../services";

export const verifyUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
    res.status(401).json(data);
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, authConfig.token);
    const userId = createObjectId(decoded.data.id);
    const user = await userRegisterService.findUser(userId);
    if (!user) {
      const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
      res.status(401).json(data);
      return;
    }

    const baseCampDetails = await userCampService.getAssignCampDetailsOfUser(
      user._id.toString()
    );
    if (baseCampDetails) {
      const client = await clientService.getClientById(
        baseCampDetails.client_id.toString()
      );
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    if (decoded.data.device_mac_id !== user.device_mac_id) {
      const data = formatResponse(
        406,
        true,
        "Already logged in new device.",
        null
      );
      res.status(406).json(data);
      return;
    }

    req.decodedToken = decoded;
  } catch (err) {
    const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
    res.status(401).json(data);
    return;
  }
  next();
};

export default { verifyUserToken };
