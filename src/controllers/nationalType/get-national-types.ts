import { Request, Response } from "express";
import { nationalTypeService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllNationalTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();

    const nationalTypes = await nationalTypeService.getAllNationalTypes(status);

    const data = formatResponse(200, false, "National type details.", {
      list: nationalTypes,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
