import { Request, Response } from "express";
import { internetPackageClientService } from "../../services";
import { createObjectId, formatResponse } from "../../helpers";
import { Obj } from "../../types/interfaces";

export const getAllInternetPackagesClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status: string = req.query.status ? req.query.status.toString() : "";
    const filter: Obj = new Object();
    if (status) {
      filter.package_status = parseInt(status);
    } else {
      filter.package_status = { $ne: 0 };
    }
    filter.client_id = createObjectId(req.decodedToken.data.id);
    const internetPackagesClient =
      await internetPackageClientService.getAllInternetPackagesClient(filter);

    const data = formatResponse(
      200,
      false,
      "Internet packages client detail.",
      { list: internetPackagesClient }
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
