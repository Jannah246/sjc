import { Request, Response } from "express";
import {
  posDeviceCodeHistoryService,
  posDeviceCodeService,
} from "../../services";
import { formatResponse } from "../../helpers";

export const deActiveDeviceCode = async (
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

    if (deviceCode.status != 1) {
      const data = formatResponse(
        400,
        true,
        "POS device code either deleted or inactivated",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (deviceCode.is_used != 1) {
      const data = formatResponse(
        400,
        true,
        "POS device code is not used so you can't deactivate this",
        null
      );
      res.status(400).json(data);
      return;
    }

    const deviceCodeHistory =
      await posDeviceCodeHistoryService.getDeviceCodeHistory(deviceCode._id);
    if (!deviceCodeHistory) {
      const data = formatResponse(
        400,
        true,
        "POS device code is not used so you can't deactivate this",
        null
      );
      res.status(400).json(data);
      return;
    }

    await posDeviceCodeHistoryService.deactivatePosDeviceCodeHistory(
      deviceCodeHistory._id
    );
    await posDeviceCodeService.deactivateDeviceCode(deviceCode._id);
    const data = formatResponse(
      200,
      false,
      "POS device code DeActivated.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
