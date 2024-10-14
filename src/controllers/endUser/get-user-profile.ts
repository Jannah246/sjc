import { Request, Response } from "express";
import {
  Message,
  createObjectId,
  formatResponse,
  getUrlOfProfileImage,
} from "../../helpers";
import { userRegisterService } from "../../services";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userRegisterService.findUserWithWallet(
      createObjectId(req.decodedToken.data.id)
    );
    if (!user) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    if (user.national_id) {
      user.national_id = getUrlOfProfileImage(user.national_id);
    }

    if (user.user_image) {
      user.user_image = getUrlOfProfileImage(user.user_image);
    }

    if (user.passport_image) {
      user.passport_image = getUrlOfProfileImage(user.passport_image);
    }

    const data = formatResponse(200, false, "User detail.", { list: user });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
