import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";

export const getCoordinatorProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = formatResponse(200, false, Message.USER_DETAIL, {
      user_data: req.decodedToken.data,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
