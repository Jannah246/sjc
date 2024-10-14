import { Request, Response } from "express";
import { clientService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "User detail.", { list: client });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
