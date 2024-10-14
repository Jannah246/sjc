import { Request, Response } from "express";
import { posService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllPos = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = req.query.status?.toString();
    const pos = await posService.getAllPos(req.decodedToken.data.id, status);
    const data = formatResponse(200, false, "Pos detail.", { list: pos });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
