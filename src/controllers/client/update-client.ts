import { Request, Response } from "express";
import { clientService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await clientService.updateClient(req.params.id, req.body);
    const data = formatResponse(
      200,
      false,
      "Client admin updated successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
