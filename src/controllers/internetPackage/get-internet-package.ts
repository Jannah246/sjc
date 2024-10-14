import { Request, Response } from "express";
import { internetPackageService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneInternetPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const internetPackage = await internetPackageService.getInternetPackageById(
      req.params.id
    );
    if (!internetPackage) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Internet package detail.", {
      list: internetPackage,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
