import { Request, Response } from "express";
import { nationalTypeService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneNationalType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nationalType = await nationalTypeService.getNationalTypeById(
      req.params.id
    );

    if (!nationalType) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "National type detail.", {
      list: nationalType,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
