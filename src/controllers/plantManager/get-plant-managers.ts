import { Request, Response } from "express";
import { plantManagerService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllPlantManagers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();

    const filter = {
      client_id: null,
      status: status
        ? parseInt(status)
        : {
            $ne: 0,
          },
    };

    const plantManagers = await plantManagerService.getAllPlantManager(filter);

    const data = formatResponse(200, false, "Plant manager details.", {
      list: plantManagers,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
