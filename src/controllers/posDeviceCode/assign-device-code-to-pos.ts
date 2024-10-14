import { Request, Response } from "express";
import {
  posAssignPosDeviceService,
  posDeviceCodeService,
  posService,
} from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  hasDuplicate,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignDeviceCodeToPos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.pos_id)) {
      const data = formatResponse(
        400,
        true,
        "POS user record not available",
        null
      );
      res.status(400).json(data);
      return;
    }

    const pos = await posService.getPosByClientIdAndId(
      req.decodedToken.data.id,
      req.body.pos_id
    );
    if (!pos) {
      const data = formatResponse(
        400,
        true,
        "POS user record not available",
        null
      );
      res.status(400).json(data);
      return;
    }

    const deviceIdArray = req.body.pos_device_codes.split(",");
    const deviceCodeArray = [];
    if (hasDuplicate(deviceIdArray)) {
      const data = formatResponse(
        400,
        true,
        Message.SOMETHING_WRONG_IN_DEVICE_SELECTION,
        null
      );
      res.status(400).json(data);
      return;
    }

    for (let index = 0; index < deviceIdArray.length; index++) {
      const element = deviceIdArray[index];
      const deviceCode = await posDeviceCodeService.deviceCodeAvailableForPos(
        req.decodedToken.data.id,
        element
      );
      if (!deviceCode) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_DEVICE_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }
      const deviceAssigned =
        await posAssignPosDeviceService.isPosAssignToDeviceModel(
          deviceCode._id.toString(),
          req.body.pos_id
        );
      if (deviceAssigned) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_DEVICE_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }

      deviceCodeArray.push(deviceCode);
    }

    const promises = [];
    for (const deviceCode of deviceCodeArray) {
      const obj = new db.posAssignPosDeviceModel();
      obj.pos_dc_id = deviceCode._id;
      obj.pos_id = createObjectId(req.body.pos_id);
      obj.status = 1;
      promises.push(posAssignPosDeviceService.assignPosToDeviceCode(obj));
    }
    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "POS device codes assigned to pos successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
