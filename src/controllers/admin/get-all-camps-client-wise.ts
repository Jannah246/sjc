import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { campService, clientService } from "../../services";

export const getAllCampsClientWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campsData = await clientService.getAllCampClientWise();
    const data = formatResponse(200, false, "camp details", {
      camp_details: campsData,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
