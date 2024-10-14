import { Request, Response } from "express";
import { Message, formatResponse } from "../../helpers";
import { userRegisterService } from "../../services";

export const newUserPhoneVerify = async (
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

    const user = await userRegisterService.findUser(req.decodedToken.data.id);
    if (!user) {
      const data = formatResponse(
        400,
        true,
        Message.SOMETHING_WENT_WRONG,
        null
      );
      res.status(400).json(data);
      return;
    }

    if (user.new_phone && user.new_phone != req.body.phone) {
      const data = formatResponse(
        400,
        true,
        "You have entered wrong mobile number for otp verification",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (user.otp != req.body.otp) {
      const data = formatResponse(400, true, "Wrong otp details", null);
      res.status(400).json(data);
      return;
    }

    const obj = {
      phone: user.new_phone,
      new_phone: "0",
    };
    await userRegisterService.updateProfile(user._id.toString(), obj);
    const data = formatResponse(
      201,
      false,
      "User new phone verified successfully.",
      null
    );
    res.status(201).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
