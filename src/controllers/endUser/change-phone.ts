import { Request, Response } from "express";
import { Message, formatResponse, generateOtp, sendOtp } from "../../helpers";
import { userRegisterService } from "../../services";

export const changeUserPhone = async (
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

    if (user.phone == req.body.phone) {
      const data = formatResponse(
        400,
        true,
        "You have entered your existing mobile number. Please add another number.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const obj = {
      otp: generateOtp(),
      new_phone: req.body.phone,
    };

    await sendOtp(user.country_code + obj.new_phone, obj.otp.toString());

    await userRegisterService.updateProfile(user._id.toString(), obj);

    const msg =
      process.env.NODE_ENV === "development"
        ? `OTP send your new entered number. [FOR DEVELOPMENT OTP: ${obj.otp.toString()}]`
        : "OTP send your new entered number.";
    const data = formatResponse(200, false, msg, null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
