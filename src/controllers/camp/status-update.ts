import { Request, Response } from "express";
import { campService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const campStatusUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const isIdAvailable = await campService.getCampByIdWithoutStatus(
      req.params.id
    );
    if (!isIdAvailable) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    await campService.updateStatus(req.params.id, req.body.status);
    const data = formatResponse(
      200,
      false,
      "Camp status updated successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
