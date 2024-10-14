import { Request, Response } from "express";
import { campService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const addCamp = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalCount = await campService.getCampsCount(
      req.decodedToken.data.id
    );
    const limit = req.decodedToken.data.no_camp;
    if (totalCount >= limit) {
      const data = formatResponse(400, true, Message.EXCEED_LIMIT, null);
      res.status(200).json(data);
      return;
    }

    await campService.createCamp(req.decodedToken.data.id, req.body);
    const data = formatResponse(200, false, "Camp created successfully.", null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
