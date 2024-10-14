import { Request, Response } from "express";
import { clientService, posDeviceCodeService } from "../../services";
import { formatResponse, generateRandomDeviceCode } from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const addDeviceCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (
      !isValidObjectId(req.body.client_id) ||
      !(await clientService.getClientById(req.body.client_id))
    ) {
      const data = formatResponse(400, true, "Client admin not found.", null);
      res.status(400).json(data);
      return;
    }

    let deviceCodeFound = null;
    let code = "";
    for (let index = 0; index < req.body.no_of_code; index++) {
      const deviceCode = new db.posDeviceCodeModel();
      deviceCode.client_id = req.body.client_id;
      deviceCode.is_used = 0;
      deviceCode.status = 1;
      do {
        code = generateRandomDeviceCode();
        deviceCodeFound = await posDeviceCodeService.isDeviceCodeFound(code);
      } while (deviceCodeFound != null);
      deviceCode.pos_device_code = code;
      await posDeviceCodeService.createDeviceCode(deviceCode);
    }

    const data = formatResponse(
      200,
      false,
      "POS device code created successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
