import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { CampAssignPosService } from "../../services";

export const getPosCamps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campDetails = await CampAssignPosService.getCampDetails(
      req.decodedToken.data.id
    );
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
