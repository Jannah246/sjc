import { Request, Response } from "express";
import { campService, posService, roleService } from "../../services";
import { Message, createObjectId, formatResponse } from "../../helpers";
import { Roles } from "../../types/enums";

export const addPos = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await roleService.getRoleBySlug(Roles.ROLE_POS);
    if (!role) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const totalCount = await posService.getPosCount(req.decodedToken.data.id);
    const limit = req.decodedToken.data.no_pos;
    if (totalCount >= limit) {
      const data = formatResponse(400, true, Message.EXCEED_LIMIT, null);
      res.status(200).json(data);
      return;
    }

    await posService.createPos(
      createObjectId(req.decodedToken.data.id),
      role._id,
      req.body
    );
    const data = formatResponse(200, false, "Pos created successfully.", null);
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
