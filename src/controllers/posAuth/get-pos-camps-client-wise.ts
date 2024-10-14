import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { campService } from "../../services";

export const getPosCampsClientWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campDetails = await campService.getCampByClientId(
      req.decodedToken.data.client_id
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
