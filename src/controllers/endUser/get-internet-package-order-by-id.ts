import { Request, Response } from "express";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { orderInternetPackageService, userCampService } from "../../services";

export const getInternetPackageOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order =
      await orderInternetPackageService.getInternetPackageFromOrderId(
        createObjectId(req.params.id),
        createObjectId(req.decodedToken.data.id)
      );
    if (!order) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Internet package order", {
      list: order,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
