import { Request, Response } from "express";
import {
  Message,
  createObjectId,
  formatResponse,
  minutesToDay,
} from "../../helpers";
import {
  CampAssignPosService,
  internetPackageClientService,
} from "../../services";
import { Obj } from "../../types/interfaces";
import { isValidObjectId } from "mongoose";
import { PosCategoryEnum } from "../../types/enums";

export const getInternetPackageList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const camp_id = req.query.profile_camp_id
      ? req.query.profile_camp_id.toString()
      : "";
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

    if (campAssignPos.camp_category == PosCategoryEnum.OFFLINE) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }

    const list =
      await internetPackageClientService.getInternetPackageForPosOrder(
        createObjectId(camp_id)
      );
    if (!list || !list.length) {
      const data = formatResponse(
        400,
        true,
        "Internet packages not found.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const internetPackageList = [];

    for (const internetPackage of list) {
      const obj: Obj = {};
      obj.package_id = internetPackage.package_id;
      obj.camp_id = internetPackage.camp_id;
      obj.assigned_id = internetPackage._id;
      obj.status = internetPackage.status;
      obj.internet_package_id =
        internetPackage.internet_package_client.internet_package_id;
      obj.package_name = internetPackage.internet_package_client.package_name;
      obj.package_code = internetPackage.internet_package_client.package_code;
      obj.package_speed = internetPackage.internet_package_client.package_speed;
      obj.package_price = internetPackage.internet_package_client.package_price;
      obj.package_status =
        internetPackage.internet_package_client.package_status;
      obj.createdAt = internetPackage.internet_package_client.createdAt;
      obj.updatedAt = internetPackage.internet_package_client.updatedAt;
      obj.camp_name = internetPackage.camp.camp_name;
      obj.camp_address = internetPackage.camp.camp_address;
      obj.camp_city = internetPackage.camp.camp_city;
      const originalPackage =
        internetPackage.internet_package_client.internet_package;
      obj.original_package_id = originalPackage._id;
      obj.original_package_name = originalPackage.package_name;
      obj.original_package_speed = originalPackage.package_speed;
      obj.original_package_code = originalPackage.package_code;
      obj.original_duration = minutesToDay(originalPackage.duration);
      obj.original_type = originalPackage.type;
      obj.original_volume = originalPackage.volume;
      obj.original_download_bandwidth = originalPackage.download_bandwidth;
      obj.original_upload_bandwidth = originalPackage.upload_bandwidth;
      obj.original_package_status = originalPackage.package_status;
      internetPackageList.push(obj);
    }
    const data = formatResponse(200, false, "Internet package list", {
      list: internetPackageList,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
