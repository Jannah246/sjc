import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { userCampService } from "../../services";

export const getBaseCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campDetails = await userCampService.getBaseCampDetailsFromUser(
      req.decodedToken.data.id
    );
    if (!campDetails) {
      const data = formatResponse(400, true, "No base camp found.", null);
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
