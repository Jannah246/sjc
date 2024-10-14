import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { campService } from "../../services";
import { isValidObjectId } from "mongoose";

export const getBaseCampUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const campId = req.query.camp_id ? req.query.camp_id.toString() : "";
    if (campId) {
      if (!isValidObjectId(campId)) {
        const data = formatResponse(400, true, Message.NOT_FOUND, null);
        res.status(400).json(data);
        return;
      }
    }

    const list = await campService.getBaseCampUserDetails(
      createObjectId(req.decodedToken.data.id),
      campId
    );
    if (!list || !list.length) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Camp with user details", {
      list: list,
    });
    res.status(200).json(data);
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
