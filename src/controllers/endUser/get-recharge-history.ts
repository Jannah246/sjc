import { Request, Response } from "express";
import { userRechargeService } from "../../services";
import { Message, formatResponse, parseToSimpleObj } from "../../helpers";
import dayjs from "dayjs";

export const getRechargeHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.decodedToken.data;
    if (!userData.location_camp.location_verified) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }

    const status = req.query.status?.toString();
    const rechargeHistory =
      await userRechargeService.getRechargeHistoryByUserId(
        req.decodedToken.data.id,
        status
      );
    const result = [];
    for (const obj of rechargeHistory) {
      const element = parseToSimpleObj(obj);
      element.transactionDate = dayjs(element.createdAt).format("DD-MMM-YYYY");
      element.transactionTime = dayjs(element.createdAt).format("hh:mm:ss a");
      result.push(element);
    }
    const data = formatResponse(200, false, "User recharge history detail.", {
      list: result,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
