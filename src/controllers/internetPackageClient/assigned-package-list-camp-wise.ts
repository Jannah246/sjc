import { Request, Response } from "express";
import { campService, internetPackageClientService } from "../../services";
import {
  Message,
  checkAllIdValid,
  convertsObjectIds,
  formatResponse,
  minutesToDay,
} from "../../helpers";
import { Obj } from "../../types/interfaces";
import { Roles } from "../../types/enums";

export const assignedPackageListCampWise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status: string = req.query.status ? req.query.status.toString() : "";
    const camp_ids: string[] = req.query.camp_ids
      ? req.query.camp_ids.toString().split(",")
      : [];

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

    let clientId = "";
    if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
      clientId = req.decodedToken.data.id;
    }

    const checkCamps = await campService.checkCampsByIdsFromClient(
      camp_ids,
      clientId
    );

    if (!checkCamps) {
      if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
        const data = formatResponse(
          200,
          true,
          Message.ACCESS_DENIED_CAMP,
          null
        );
        res.status(200).json(data);
        return;
      } else {
        const data = formatResponse(400, true, Message.NOT_FOUND, null);
        res.status(400).json(data);
        return;
      }
    }
    const assignedPackageListCampWise =
      await internetPackageClientService.assignedPackageListCampsWise(
        convertsObjectIds(camp_ids),
        status
      );

    const results = [];

    for (const a of assignedPackageListCampWise) {
      const obj: Obj = {
        package_id: a.package_id,
        camp_id: a.camp_id,
        assigned_status: a.status,
        id: a.package_id,
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
