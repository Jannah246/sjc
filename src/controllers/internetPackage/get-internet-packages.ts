import { Request, Response } from "express";
import { internetPackageService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllInternetPackages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status: string = req.query.status ? req.query.status.toString() : "";
    const internetPackages = await internetPackageService.getAllInternetPackage(
      status
    );
    const data = formatResponse(200, false, "Internet package detail.", {
      list: internetPackages,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
