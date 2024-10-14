import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Message, formatResponse } from "../../helpers";
import { countriesService } from "../../services";

export const isCountryIdIsExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.id || !isValidObjectId(req.params.id)) {
    const data = formatResponse(400, true, Message.NOT_FOUND, null);
    res.status(400).json(data);
    return;
  }

  const isIdAvailable = await countriesService.getCountryById(req.params.id);
  if (!isIdAvailable) {
    const data = formatResponse(400, true, Message.NOT_FOUND, null);
    res.status(400).json(data);
    return;
  }

  next();
};
