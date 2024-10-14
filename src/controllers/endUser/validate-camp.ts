import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { campService, userCampService } from "../../services";
import jwt from "jsonwebtoken";
import { authConfig } from "../../config/auth.config";
import { isValidObjectId } from "mongoose";

export const validateCamp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.camp_id) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }
    const userData = req.decodedToken.data;

    let campData;

    if (!isValidObjectId(req.body.camp_id)) {
      const data = formatResponse(
        400,
        true,
        Message.LOCATION_CAMP_NO_AVAILABLE,
        null
      );
      res.status(400).json(data);
      return;
    }

    campData = await campService.getCampById(req.body.camp_id);
    if (!campData) {
      const data = formatResponse(
        400,
        true,
        Message.LOCATION_CAMP_NO_AVAILABLE,
        null
      );
      res.status(400).json(data);
      return;
    }

    const baseCampDetails = await userCampService.getAssignCampDetailsOfUser(
      userData.id.toString()
    );

    const location_camp = {
      location_camp_id: req.body.camp_id ? req.body.camp_id : null,
      location_verified: req.body.camp_id ? true : false,
      location_camp_client_id: campData ? campData.client_id : null,
    };
    const jwtData = {
      data: {
        ...userData,
        baseCampAvailable: baseCampDetails ? true : false,
        location_camp: location_camp,
      },
    };
    //Generated jwt token
    const token = jwt.sign(jwtData, authConfig.token, {
      expiresIn: authConfig.expiresIn,
    });
    const data = formatResponse(201, false, Message.CAMP_FOUND, {
      user_data: jwtData.data,
      token: token,
    });
    res.status(201).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
