import { Request, Response } from "express";
import { Message, validPassword } from "../../helpers";
import { formatResponse } from "../../helpers";
import { generateHash } from "../../helpers";
import { adminService } from "../../services";

export const updatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await adminService.getAdminById(req.decodedToken.data.id);
    if (!user) {
      const data = formatResponse(401, true, Message.NOT_FOUND, null);
      res.status(401).json(data);
      return;
    }

    if (!validPassword(req.body.current_password, user.password)) {
      const data = formatResponse(
        401,
        true,
        Message.CURRENT_PASSWORD_INCORRECT,
        null
      );
      res.status(200).json(data);
      return;
    }

    user.password = generateHash(req.body.new_password);
    await adminService.updateOne(user._id, {
      _id: req.decodedToken.data.id,
      password: user.password,
    });
    const data = formatResponse(
      200,
      false,
      Message.PASSWORD_UPDATE_SUCCESS,
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
