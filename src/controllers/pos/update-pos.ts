import { Request, Response } from "express";
import { posService, roleService } from "../../services";
import { Message, createObjectId, formatResponse } from "../../helpers";

export const updatePos = async (req: Request, res: Response): Promise<void> => {
  try {
    await posService.updatePos(req.params.id, req.body);
    const data = formatResponse(200, false, "Pos updated successfully.", null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
