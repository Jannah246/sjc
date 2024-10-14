import { Request, Response } from "express";
import { internetPackageClientService } from "../../services";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { Obj } from "../../types/interfaces";

export const getOneInternetPackageClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filter: Obj = new Object();
    filter._id = createObjectId(req.params.id);
    filter.client_id = createObjectId(req.decodedToken.data.id);

    const internetPackageClient =
      await internetPackageClientService.getAllInternetPackagesClient(filter);
    if (!internetPackageClient) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Internet package detail.", {
      list: internetPackageClient.length ? internetPackageClient[0] : null,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
