import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { nationalTypeService } from "../../services";

export const addNationalType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await nationalTypeService.createNationalType(req.body);

    const data = formatResponse(
      200,
      false,
      "National type created successfully.",
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
