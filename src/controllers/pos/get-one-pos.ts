import { Request, Response } from "express";
import { posService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOnePos = async (req: Request, res: Response): Promise<void> => {
  try {
    const pos = await posService.getPosById(req.params.id);
    if (!pos) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Pos detail.", { list: pos });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
