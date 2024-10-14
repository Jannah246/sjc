import { Request, Response } from "express";
import { internetPackageClientService } from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  minutesToDay,
} from "../../helpers";
import { Obj } from "../../types/interfaces";
import { isValidObjectId } from "mongoose";

export const assignedCampsListClientPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status: string = req.query.status ? req.query.status.toString() : "";
    const client_package_id: string = req.query.client_package_id
      ? req.query.client_package_id.toString()
      : "";

    const idValid = await isValidObjectId(client_package_id);
    if (!idValid) {
      const data = formatResponse(200, true, Message.NOT_FOUND, null);
      res.status(200).json(data);
      return;
    }

    const assignedCampsListClientPackage =
      await internetPackageClientService.assignedPackageListClientPackageWise(
        client_package_id,
        status,
        req.decodedToken.data.id
      );

    const results = [];

    for (const a of assignedCampsListClientPackage) {
      const obj: Obj = {
        assigned_id: a._id,
        package_id: a.package_id,
        camp_id: a.camp_id,
        assigned_status: a.status,
        id: a.camp_id,
        client_id: a.internet_package_client
          ? a.internet_package_client.client_id
          : "",
        internet_package_id: a.internet_package_client
          ? a.internet_package_client.internet_package_id
          : "",
        package_name: a.internet_package_client
          ? a.internet_package_client.package_name
          : "",
        package_code: a.internet_package_client
          ? a.internet_package_client.package_code
          : "",
        package_speed: a.internet_package_client
          ? a.internet_package_client.package_speed
          : "",
        package_status: a.internet_package_client
          ? a.internet_package_client.package_status
          : "",
        package_price: a.internet_package_client
          ? a.internet_package_client.package_price
          : "",
        created_at: a.createdAt,
        updated_at: a.updatedAt,
        deleted_at: a.deleted_at,
        camp_name: a.camp ? a.camp.camp_name : "",
        camp_city: a.camp ? a.camp.camp_city : "",
        router_primary_ip: a.camp ? a.camp.router_primary_ip : "",
        no_of_allowed_user: a.camp ? a.camp.no_of_allowed_user : "",
        no_of_allowed_kiosk: a.camp ? a.camp.no_of_allowed_kiosk : "",
        no_of_allowed_account: a.camp ? a.camp.no_of_allowed_account : "",
        no_of_allowed_coordinators: a.camp
          ? a.camp.no_of_allowed_coordinators
          : "",
        is_allowed_package_meal: a.camp ? a.camp.is_allowed_package_meal : "",
        is_allowed_package_water: a.camp ? a.camp.is_allowed_package_water : "",
        is_allowed_package_internet: a.camp
          ? a.camp.is_allowed_package_internet
          : "",
        status: a.camp ? a.camp.status : "",
        router_mac_address: a.camp ? a.camp.router_mac_address : "",
        router_ssid: a.camp ? a.camp.router_ssid : "",
        router_secondary_ip: a.camp ? a.camp.router_secondary_ip : "",
        router_pass: a.camp ? a.camp.router_pass : "",
        router_secret: a.camp ? a.camp.router_secret : "",
        router_alias: a.camp ? a.camp.router_alias : "",
        router_hostname: a.camp ? a.camp.router_hostname : "",
        camp_uuid: a.camp ? a.camp.camp_uuid : "",
        original_package_name:
          a?.internet_package_client?.internet_package?.package_name || "",
        original_package_code:
          a?.internet_package_client?.internet_package?.package_code || "",
        original_package_speed:
          a?.internet_package_client?.internet_package?.package_speed || "",
        original_package_status:
          a?.internet_package_client?.internet_package?.package_status || "",
        original_duration:
          minutesToDay(
            a?.internet_package_client?.internet_package?.duration
          ) || "",
        original_type: a?.internet_package_client?.internet_package?.type || "",
        original_volume:
          a?.internet_package_client?.internet_package?.volume || "",
        original_download_bandwidth:
          a?.internet_package_client?.internet_package?.download_bandwidth ||
          "",
        original_upload_bandwidth:
          a?.internet_package_client?.internet_package?.upload_bandwidth || "",
      };

      results.push(obj);
    }

    const data = formatResponse(200, false, "", { list: results });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
