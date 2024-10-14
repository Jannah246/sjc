import { Request, Response } from "express";
import {
  internetPackageClientService,
  internetPackageService,
} from "../../services";
import {
  Message,
  formatResponse,
  generateRandomPackageCode,
} from "../../helpers";

export const addInternetPackageClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const internetPackageClientModel = req.body;

    const internetPackage = await internetPackageService.getInternetPackageById(
      req.body.internet_package_id
    );
    if (!internetPackage) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }
    const checkAssignFromAdmin =
      await internetPackageService.checkAssignedInternetPackageByAdmin(
        req.decodedToken.data.id,
        req.body.internet_package_id
      );
    if (!checkAssignFromAdmin) {
      const data = formatResponse(
        400,
        true,
        Message.ACCESS_DENIED_PACKAGE,
        null
      );
      res.status(400).json(data);
      return;
    }

    internetPackageClientModel.client_id = req.decodedToken.data.id;
    internetPackageClientModel.package_code = internetPackage.package_code;

    await internetPackageClientService.createInternetPackageClient(
      internetPackageClientModel
    );
    const data = formatResponse(
      200,
      false,
      "Internet package client created successfully.",
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
