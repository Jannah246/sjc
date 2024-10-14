import { Request, Response } from "express";
import { plantManagerService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getPlantManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plantManager = await plantManagerService.getPlantManagerById(
      req.params.id
    );

    if (!plantManager) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Plant manager detail.", {
      list: plantManager,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
