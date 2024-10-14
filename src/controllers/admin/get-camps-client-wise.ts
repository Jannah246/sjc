import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { campService } from "../../services";

export const getCampsClientWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campDetails = await campService.getCampByClientId(req.params.id);
    if (!campDetails || !campDetails.length) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "camp details", {
      camp_details: campDetails,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
