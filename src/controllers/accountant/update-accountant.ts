import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { accountantService } from "../../services";

export const updateAccountant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await accountantService.updateAccountant(req.params.id, req.body);
    const data = formatResponse(
      200,
      false,
      "Accountant updated successfully.",
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
