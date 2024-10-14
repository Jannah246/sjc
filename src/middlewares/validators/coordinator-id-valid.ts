import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Message, formatResponse } from "../../helpers";
import { coordinatorService } from "../../services";
import { Roles } from "../../types/enums";

export const isCoordinatorIdIsExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.id || !isValidObjectId(req.params.id)) {
    const data = formatResponse(400, true, Message.NOT_FOUND, null);
    res.status(400).json(data);
    return;
  }

  let client_id = null;
  if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
    client_id = req.decodedToken.data.id;
  }

  const isIdAvailable = await coordinatorService.getCoordinatorById(
    req.params.id,
    client_id
  );
  if (!isIdAvailable) {
    const data = formatResponse(400, true, Message.NOT_FOUND, null);
    res.status(400).json(data);
    return;
  }

  next();
};
