import { Request, Response } from "express";
import { campService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const camp = await campService.getCampById(req.params.id);
    if (!camp) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Camp detail.", { list: camp });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
