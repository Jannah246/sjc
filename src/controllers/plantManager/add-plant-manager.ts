import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { plantManagerService, roleService } from "../../services";
import { Roles } from "../../types/enums";

export const addPlantManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await roleService.getRoleBySlug(Roles.ROLE_PLANT_MANAGER);

    if (!role) {
      const data = formatResponse(
        401,
        true,
        "Plant manager role not available.",
        null
      );
      res.status(401).json(data);
      return;
    }

    await plantManagerService.createPlantManager(role._id, req.body);

    const data = formatResponse(
      200,
      false,
      "Plant manager created successfully.",
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
