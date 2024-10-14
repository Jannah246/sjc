const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

import { Message, createObjectId, formatResponse } from "../../helpers";
import { authConfig } from "../../config/auth.config";
import { clientService } from "../../services";

export const verifyClientToken = async (
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
    const clientId = createObjectId(decoded.data.id);
    const client = await clientService.getClientWithRole(clientId);
    if (!client || !client.length) {
      const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
      res.status(401).json(data);
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

export default { verifyClientToken };
