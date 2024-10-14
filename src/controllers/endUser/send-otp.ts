import { Request, Response } from "express";
import { Message, formatResponse, generateOtp, sendOtp } from "../../helpers";
import {
  clientService,
  userCampService,
  userRegisterService,
} from "../../services";
import db from "../../models";

export const sendUserOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userRegisterService.findUserByMobileNumber(
      req.body.mobile
    );
    if (!user) {
      const newUser = new db.userRegisterModel();
      newUser.phone = req.body.mobile;
      newUser.otp = generateOtp();
      newUser.device_mac_id = req.body.device_mac_id;
      newUser.country_code = req.body.country_code;
      newUser.status = 5;
      newUser.is_new_user = true;

      await sendOtp(
        newUser.country_code + newUser.phone,
        newUser.otp.toString()
      );

      const createdUser = await userRegisterService.createUser(newUser);
      const obj = {
        user_data: {
          id: createdUser._id,
          client_id: 0, //TODO remain client id association
          name: createdUser.name,
          //otp: createdUser.otp,
          has_transfer_request: createdUser.has_transfer_request,
        },
      };
      const msg =
        process.env.NODE_ENV === "development"
          ? `OTP send your registered number. [FOR DEVELOPMENT OTP: ${createdUser.otp}]`
          : "OTP send your registered number.";
      const data = formatResponse(200, false, msg, obj);
      res.status(200).json(data);
      return;
    }

    const baseCampDetails = await userCampService.getAssignCampDetailsOfUser(
      user._id.toString()
    );
    if (baseCampDetails) {
      const client = await clientService.getClientById(
        baseCampDetails.client_id.toString()
      );
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    user.otp = generateOtp();
    user.device_mac_id = req.body.device_mac_id;
    user.country_code = req.body.country_code;
    user.status = 5;

    await sendOtp(user.country_code + user.phone, user.otp.toString());

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

    const obj = {
      user_data: {
        id: updatedUser._id,
        client_id: 0, //TODO remain client id association
        name: updatedUser.name,
        // otp: updatedUser.otp,
        has_transfer_request: updatedUser.has_transfer_request,
      },
    };
    const msg =
      process.env.NODE_ENV === "development"
        ? `OTP send your registered number. [FOR DEVELOPMENT OTP: ${updatedUser.otp}]`
        : "OTP send your registered number.";

    const data = formatResponse(200, false, msg, obj);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    console.log(e);
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
