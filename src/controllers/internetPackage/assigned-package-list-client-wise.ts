import { Request, Response } from "express";
import { internetPackageService } from "../../services";
import { formatResponse, minutesToDay } from "../../helpers";
import { Obj } from "../../types/interfaces";

export const assignedPackageListClientWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status: string = req.query.status ? req.query.status.toString() : "";
    const client_id: string = req.query.client_id
      ? req.query.client_id.toString()
      : "";
    const assignedPackageListClientWise =
      await internetPackageService.assignedPackageListClientWise(
        client_id,
        status
      );

    const result = [];

    for (const element of assignedPackageListClientWise) {
      const obj: Obj = {};
      obj.id = element._id;
      obj.client_id = element.client_id;
      obj.internet_package_id = element.internet_package_id;
      obj.attached_uuid = element.attached_uuid;
      obj.created_at = element.createdAt;
      obj.updated_at = element.updatedAt;
      obj.deleted_at = element.deleted_at;
      obj.original_package_name = "";
      obj.original_package_code = "";
      obj.original_package_speed = "";
      obj.original_package_status = "";
      obj.original_duration = "";
      obj.original_type = "";
      obj.original_volume = "";
      obj.original_download_bandwidth = "";
      obj.original_upload_bandwidth = "";
      if (element.internet_package) {
        obj.original_package_name = element.internet_package.package_name;
        obj.original_package_code = element.internet_package.package_code;
        obj.original_package_speed = element.internet_package.package_speed;
        obj.original_package_status = element.internet_package.package_status;
        obj.original_duration = minutesToDay(element.internet_package.duration);
        obj.original_type = element.internet_package.type;
        obj.original_volume = element.internet_package.volume;
        obj.original_download_bandwidth =
          element.internet_package.download_bandwidth;
        obj.original_upload_bandwidth =
          element.internet_package.upload_bandwidth;
      }

      result.push(obj);
    }

    const data = formatResponse(200, false, "", { list: result });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
