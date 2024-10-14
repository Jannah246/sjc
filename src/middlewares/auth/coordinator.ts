const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

import { Message, formatResponse } from "../../helpers";
import { authConfig } from "../../config/auth.config";
import { clientService, coordinatorService } from "../../services";

export const verifyCoordinatorToken = async (
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
    const coordinatorId = decoded.data.id;
    const clientId = decoded.data.client_id;
    if (clientId) {
      const client = await clientService.getClientById(clientId);
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    const user = await coordinatorService.getCoordinatorById(
      coordinatorId,
      clientId
    );
    if (!user) {
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

export default { verifyCoordinatorToken };
