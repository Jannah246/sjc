import { Request, Response } from "express";
import { campService, posService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const posStatusUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const isIdAvailable = await posService.getPosByIdWithoutStatus(
      req.params.id
    );
    if (!isIdAvailable) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    await posService.updateStatus(req.params.id, req.body.status);
    const data = formatResponse(
      200,
      false,
      "Pos status updated successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
