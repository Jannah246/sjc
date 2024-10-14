import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import {
  CampAssignPosService,
  orderInternetPackageService,
} from "../../services";
import { isValidObjectId } from "mongoose";

export const getInternetPackageOrderCampWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const camp_id = req.query.profile_camp_id
      ? req.query.profile_camp_id.toString()
      : "";
    const status = req.query.order_status?.toString();
    if (!isValidObjectId(camp_id)) {
      const data = formatResponse(400, true, Message.CAMP_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const campAssignPos = await CampAssignPosService.isCampAssignToPos(
      req.decodedToken.data.id,
      camp_id
    );
    if (!campAssignPos) {
      const data = formatResponse(400, true, "Camp not assigned to pos.", null);
      res.status(400).json(data);
      return;
    }

    const list = await orderInternetPackageService.getInternetPackageForCamp(
      createObjectId(camp_id),
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
