import { Request, Response } from "express";
import {
  Message,
  formatResponse,
  generateRandomPackageCode,
  parseToSimpleObj,
} from "../../helpers";
import {
  campService,
  userCampService,
  userRegisterService,
} from "../../services";
import jwt from "jsonwebtoken";
import { authConfig } from "../../config/auth.config";
import { isValidObjectId } from "mongoose";

export const verifyUserOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userRegisterService.findUserForVerification(
      req.body.mobile,
      req.body.otp,
      req.body.device_mac_id,
      req.body.country_code
    );
    if (!user) {
      const data = formatResponse(400, true, "Wrong otp details", null);
      res.status(400).json(data);
      return;
    }

    // if (user.is_new_user && !req.body.camp_id) {
    //   const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
    //   res.status(400).json(data);
    //   return;
    // }

    let campData;
    if (req.body.camp_id) {
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
    }

    const is_new_user = user.is_new_user;
    if (user.is_new_user) {
      let foundRecord = null;
      let code = "";
      do {
        code = generateRandomPackageCode();
        foundRecord = await userRegisterService.isUuidFound(code);
      } while (foundRecord != null);
      user.uuid = code;
    }

    user.status = 1;
    user.is_new_user = false;
    const updatedUser = await userRegisterService.updateUser(
      user._id.toString(),
      user
    );
    if (!updatedUser) {
      const data = formatResponse(
        500,
        true,
        Message.SOMETHING_WENT_WRONG,
        null
      );
      res.status(500).json(data);
      return;
    }

    const obj = parseToSimpleObj(updatedUser);
    obj.is_new_user = is_new_user;
    delete obj.password;

    const baseCampDetails = await userCampService.getAssignCampDetailsOfUser(
      user._id.toString()
    );

    const location_camp = {
      location_camp_id: req.body.camp_id ? req.body.camp_id : null,
      location_verified: req.body.camp_id ? true : false,
      location_camp_client_id: campData ? campData.client_id : null,
    };
    const jwtData = {
      data: {
        ...obj,
        baseCampAvailable: baseCampDetails ? true : false,
        location_camp: location_camp,
      },
    };
    //Generated jwt token
    const token = jwt.sign(jwtData, authConfig.token, {
      expiresIn: authConfig.expiresIn,
    });
    const data = formatResponse(201, false, Message.LOGIN_SUCCESS, {
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
