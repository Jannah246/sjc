import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { plantManagerService } from "../../services";

export const updatePlantManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await plantManagerService.updatePlantManager(req.params.id, req.body);

    const data = formatResponse(
      200,
      false,
      "Plant manager updated successfully.",
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
