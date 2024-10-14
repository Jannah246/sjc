import { Request, Response } from "express";
import { userRegisterService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword ? req.query.keyword.toString() : "";
    const users = await userRegisterService.userSearchWithKeyword(keyword);
    if (!users || !users.length) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "User details.", { list: users });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
