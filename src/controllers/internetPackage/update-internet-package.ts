import { Request, Response } from "express";
import { internetPackageService } from "../../services";
import { formatResponse } from "../../helpers";

export const updateInternetPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await internetPackageService.updateInternetPackage(req.params.id, req.body);
    const data = formatResponse(
      200,
      false,
      "Internet package updated successfully.",
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
