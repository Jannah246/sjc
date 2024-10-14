import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { campService, userCampService } from "../../services";

export const getClientWiseCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.decodedToken.data;

    const campAssignedToUser = await userCampService.getAssignCampDetailsOfUser(
      userData.id
    );
    if (!campAssignedToUser) {
      const data = formatResponse(
        400,
        true,
        "User not assigned to any camp.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const camps = await campService.getCampByClientId(
      campAssignedToUser.client_id.toString()
    );
    let baseCamp = {};
    const otherCampsList = [];
    for (const c of camps) {
      if (c._id.toString() === campAssignedToUser.camp_id.toString()) {
        console.log(c);
        baseCamp = c;
      } else {
        otherCampsList.push(c);
      }
    }

    const data = formatResponse(200, false, "Camp details", {
      baseCamp: baseCamp,
      clientOtherCamps: otherCampsList,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
