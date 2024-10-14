import { Request, Response } from "express";
import {
  campAssignPosDeviceService,
  campService,
  posDeviceCodeService,
} from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  hasDuplicate,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignDeviceCodeToCamps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deviceCode = await posDeviceCodeService.deviceCodeAvailableForActive(
      req.decodedToken.data.id,
      req.body.pos_device_code
    );

    if (!deviceCode) {
      const data = formatResponse(400, true, "POS device code not found", null);
      res.status(400).json(data);
      return;
    }

    if (deviceCode.is_used != 1) {
      const data = formatResponse(
        400,
        true,
        "POS device code not active",
        null
      );
      res.status(400).json(data);
      return;
    }

    const campIdArray = req.body.camp_ids.split(",");
    if (hasDuplicate(campIdArray)) {
      const data = formatResponse(
        400,
        true,
        Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
        null
      );
      res.status(400).json(data);
      return;
    }

    for (const camp of campIdArray) {
      if (!isValidObjectId(camp)) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }

      const clientIdPromise = campService.getCampByClientIdAndId(
        req.decodedToken.data.id,
        camp
      );
      const isCampAssignToDevicePromise =
        campAssignPosDeviceService.isCampAssignToDeviceModel(
          deviceCode._id.toString(),
          camp
        );
      const [clientId, isCampAssignToDevice] = await Promise.all([
        clientIdPromise,
        isCampAssignToDevicePromise,
      ]);
      if (!clientId || isCampAssignToDevice) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }
    }

    const promises = [];
    for (const camp of campIdArray) {
      const obj = new db.campAssignPosDeviceModel();
      obj.camp_id = createObjectId(camp);
      obj.pos_dc_id = deviceCode._id;
      obj.status = 1;
      promises.push(campAssignPosDeviceService.assignCampToDeviceCode(obj));
    }
    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "POS device assigned to camps successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
