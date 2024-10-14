import { Request, Response } from "express";
import {
  Message,
  checkAllIdValid,
  formatResponse,
  generateRandomPackageCode,
  hasDuplicate,
} from "../../helpers";
import { campService, internetPackageClientService } from "../../services";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignCamps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const objAssignCamps = req.body;
    const camp_ids = objAssignCamps.camp_ids.split(",");

    const idValid = await checkAllIdValid(camp_ids);

    if (!idValid) {
      const data = formatResponse(
        200,
        true,
        Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
        null
      );
      res.status(200).json(data);
      return;
    }

    const isDuplicate = await hasDuplicate(camp_ids);

    if (isDuplicate) {
      const data = formatResponse(
        200,
        true,
        Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
        null
      );
      res.status(200).json(data);
      return;
    }

    const checkCamps = await campService.checkCampsByIdsFromClient(
      camp_ids,
      req.decodedToken.data.id
    );

    if (!checkCamps) {
      const data = formatResponse(200, true, Message.ACCESS_DENIED_CAMP, null);
      res.status(200).json(data);
      return;
    }

    if (!isValidObjectId(objAssignCamps.package_id)) {
      const data = formatResponse(200, true, "No record available", null);
      res.status(200).json(data);
      return;
    }

    const checkInternetPackage =
      await internetPackageClientService.getInternetPackageClientById(
        objAssignCamps.package_id,
        req.decodedToken.data.id
      );
    if (!checkInternetPackage) {
      const data = formatResponse(200, true, "No record available", null);
      res.status(200).json(data);
      return;
    }

    const objAssignCampsList = [];
    for (const element of camp_ids) {
      const checkDuplicate =
        await internetPackageClientService.getAssignCampsByPackageIdAndCampId(
          element,
          objAssignCamps.package_id
        );
      if (checkDuplicate) {
        const data = formatResponse(
          200,
          true,
          "Internet package already assigned to camp",
          null
        );
        res.status(200).json(data);
        return;
      }
      const obj = new db.InternetPackageAssignCampsModel();
      obj.camp_id = element;
      obj.package_id = objAssignCamps.package_id;
      obj.camp_attach_uuid = generateRandomPackageCode();
      obj.status = 1;
      objAssignCampsList.push(obj);
    }

    await internetPackageClientService.assignCamps(objAssignCampsList);
    const data = formatResponse(
      200,
      false,
      "Internet package assigned to camp successfully",
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
