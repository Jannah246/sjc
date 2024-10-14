import { Request, Response } from "express";
import { clientService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllClients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();
    const clients = await clientService.getAllClient(status);
    const data = formatResponse(200, false, "User detail.", { list: clients });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
