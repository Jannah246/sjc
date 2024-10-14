import { Request, Response } from "express";
import {
  Message,
  checkAllIdValid,
  formatResponse,
  generateRandomPackageCode,
  hasDuplicate,
} from "../../helpers";
import { clientService, internetPackageService } from "../../services";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignClients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const objAssignClients = req.body;
    const client_ids = objAssignClients.client_ids.split(",");

    const idValid = await checkAllIdValid(client_ids);
    if (!idValid) {
      const data = formatResponse(200, true, Message.INVALID_CLIENT_IDS, null);
      res.status(200).json(data);
      return;
    }

    const isDuplicate = await hasDuplicate(client_ids);
    if (isDuplicate) {
      const data = formatResponse(200, true, Message.INVALID_CLIENT_IDS, null);
      res.status(200).json(data);
      return;
    }

    const checkClients = await clientService.checkClientsByIds(client_ids);
    if (!checkClients) {
      const data = formatResponse(200, true, Message.INVALID_CLIENT_IDS, null);
      res.status(200).json(data);
      return;
    }

    if (!isValidObjectId(objAssignClients.internet_package_id)) {
      const data = formatResponse(200, true, "No record available", null);
      res.status(200).json(data);
      return;
    }

    const checkInternetPackage =
      await internetPackageService.getInternetPackageById(
        objAssignClients.internet_package_id
      );
    if (!checkInternetPackage) {
      const data = formatResponse(200, true, "No record available", null);
      res.status(200).json(data);
      return;
    }

    const objAssignClientsList = [];
    for (const element of client_ids) {
      const checkDuplicate =
        await internetPackageService.getAssignClientByPackageIdAndClientId(
          element,
          objAssignClients.internet_package_id
        );
      if (checkDuplicate) {
        const data = formatResponse(
          200,
          true,
          "Internet package already assigned to client",
          null
        );
        res.status(200).json(data);
        return;
      }
      const obj = new db.InternetPackageAssignClientModel();
      obj.client_id = element;
      obj.internet_package_id = objAssignClients.internet_package_id;
      obj.attached_uuid = generateRandomPackageCode();
      objAssignClientsList.push(obj);
    }

    await internetPackageService.assignClients(objAssignClientsList);
    const data = formatResponse(
      200,
      false,
      "Internet package assigned to client successfully",
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
