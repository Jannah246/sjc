import { Request, Response } from "express";
import { posDeviceCodeService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneDeviceCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deviceCode = await posDeviceCodeService.getPosDeviceCodeById(
      req.params.id
    );
    if (!deviceCode) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Device code detail.", {
      list: deviceCode,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
