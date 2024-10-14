import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import {
  orderInternetPackageService,
  userCampService,
  userRegisterService,
} from "../../services";
import { isValidObjectId } from "mongoose";

export const getInternetPackageOrderUserWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.query?.user_id ? req.query.user_id?.toString() : "";
    const status = req.query.order_status?.toString();

    if (!isValidObjectId(userId)) {
      const data = formatResponse(400, true, Message.USER_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const user = await userRegisterService.findUser(createObjectId(userId));
    if (!user) {
      const data = formatResponse(400, true, Message.USER_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const assignCampDetails = await userCampService.getAssignCampDetailsOfUser(
      userId
    );
    if (!assignCampDetails) {
      const data = formatResponse(
        400,
        true,
        "User not assigned to any camp.",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (
      req.decodedToken.data.client_id !== assignCampDetails.client_id.toString()
    ) {
      const data = formatResponse(
        400,
        true,
        "User and pos user not of same client.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const list = await orderInternetPackageService.getInternetPackageForUser(
      createObjectId(userId),
      status
    );
    if (!list || !list.length) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Internet package order list", {
      list: list,
    });
    res.status(200).json(data);
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
