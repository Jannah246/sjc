import { Request, Response } from "express";
import { posDeviceCodeService } from "../../services";
import { formatResponse } from "../../helpers";
import { Obj } from "../../types/interfaces";

export const getAllDeviceCodesByClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();
    const posDeviceCodes =
      await posDeviceCodeService.getDeviceCodeWithHistoryByClient(
        req.decodedToken.data.id,
        status
      );
    const result = [];
    for (let index = 0; index < posDeviceCodes.length; index++) {
      const obj: Obj = {};
      const element = posDeviceCodes[index];
      obj.id = element._id;
      obj.client_id = element.client_id;
      obj.is_used = element.is_used;
      obj.status = element.status;
      obj.pos_device_code = element.pos_device_code;
      obj.device_name = "";
      obj.device_model = "";
      obj.device_mac_address = "";
      obj.code_status = "";
      obj.id_history = "";
      if (element.pos_device_code_history) {
        obj.device_name = element.pos_device_code_history.device_name;
        obj.device_model = element.pos_device_code_history.device_model;
        obj.device_mac_address =
          element.pos_device_code_history.device_mac_address;
        obj.code_status = element.pos_device_code_history.code_status;
        obj.id_history = element.pos_device_code_history._id;
      }

      result.push(obj);
    }

    const data = formatResponse(200, false, "Device code detail.", {
      list: result,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
