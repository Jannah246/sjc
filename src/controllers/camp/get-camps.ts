import { Request, Response } from "express";
import { campService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllCamps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();
    const camps = await campService.getAllCamps(
      req.decodedToken.data.id,
      status
    );
    const data = formatResponse(200, false, "Camp detail.", { list: camps });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
