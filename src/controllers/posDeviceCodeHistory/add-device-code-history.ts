import { Request, Response } from "express";
import {
  posDeviceCodeHistoryService,
  posDeviceCodeService,
} from "../../services";
import { formatResponse } from "../../helpers";

export const addDeviceCodeHistory = async (
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

    if (deviceCode.is_used != 0) {
      const data = formatResponse(
        400,
        true,
        "POS device code already activated. Please de-active first existing one.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const deviceCodeActiveWithMac =
      await posDeviceCodeHistoryService.getDeviceByMacAddress(
        req.body.device_mac_address
      );
    if (deviceCodeActiveWithMac) {
      const data = formatResponse(
        400,
        true,
        "Device mac address already associate with another device code.Please provide new mac address.",
        null
      );
      res.status(400).json(data);
      return;
    }

    await posDeviceCodeHistoryService.createPosDeviceHistory(
      deviceCode._id,
      req.body
    );
    await posDeviceCodeService.activeDeviceCode(deviceCode._id);
    const data = formatResponse(200, false, "POS device code activated.", null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
