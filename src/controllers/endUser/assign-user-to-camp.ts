import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { campService, clientService, userCampService } from "../../services";
import db from "../../models";
import { isValidObjectId } from "mongoose";

export const assignUserToCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.decodedToken.data;
    if (!userData.location_camp.location_verified) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }

    if (!isValidObjectId(req.body.camp_id)) {
      const data = formatResponse(400, true, Message.CAMP_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const camp = await campService.getCampById(req.body.camp_id);
    if (!camp) {
      const data = formatResponse(400, true, Message.CAMP_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const campAssignedToUser = await userCampService.getAssignCampDetailsOfUser(
      req.decodedToken.data.id
    );
    if (campAssignedToUser) {
      const data = formatResponse(
        400,
        true,
        "User already assigned to camp",
        null
      );
      res.status(400).json(data);
      return;
    }

    const client = await clientService.getClientById(camp.client_id.toString());
    if (!client) {
      const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
      res.status(401).json(data);
      return;
    }

    const userCamp = new db.userCampModel();
    userCamp.user_id = createObjectId(req.decodedToken.data.id);
    userCamp.camp_id = camp._id;
    userCamp.client_id = camp.client_id;
    userCamp.status = 1;
    await userCampService.assignUserToCamp(userCamp);
    const data = formatResponse(200, false, "User camp assigned successfully", {
      list: camp,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
