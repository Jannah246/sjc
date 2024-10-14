import { Request, Response } from "express";
import { campService } from "../../services";
import { Message, createObjectId, formatResponse } from "../../helpers";

export const getAssignPosDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id ? req.params.id : "";
    const camps = await campService.getCampAssignDeviceDetails(
      createObjectId(id),
      createObjectId(req.decodedToken.data.id)
    );
    if (!camps || !camps.length) {
      const data = formatResponse(400, true, "Camp record not available", null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "camp assign pos device details", {
      list: camps,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
