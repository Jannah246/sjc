import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { campService } from "../../services";

export const updateCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await campService.updateCamp(req.params.id, req.body);
    const data = formatResponse(200, false, "Camp updated successfully.", null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
