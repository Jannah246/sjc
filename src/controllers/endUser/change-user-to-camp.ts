import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { campService, userCampService } from "../../services";
import db from "../../models";
import { isValidObjectId } from "mongoose";

export const changeUserToCamp = async (
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

    if (campAssignedToUser.camp_id.toString() === req.body.camp_id) {
      const data = formatResponse(
        400,
        true,
        "User already assigned to this camp.",
        null
      );
      res.status(400).json(data);
      return;
    }
    if (campAssignedToUser.client_id.toString() !== camp.client_id.toString()) {
      const data = formatResponse(
        400,
        true,
        "Camp id and base camp id not of same client.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const promises = [];
    promises.push(userCampService.deactivateBaseCamp(campAssignedToUser._id));

    const userCamp = new db.userCampModel();
    userCamp.user_id = createObjectId(req.decodedToken.data.id);
    userCamp.camp_id = camp._id;
    userCamp.client_id = camp.client_id;
    userCamp.status = 1;
    promises.push(userCampService.assignUserToCamp(userCamp));

    await Promise.all(promises);
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
