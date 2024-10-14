import { Request, Response } from "express";
import { roleService, clientService } from "../../services";
import db from "../../models";
import { Message, formatResponse } from "../../helpers";
import { Roles } from "../../types/enums";

export const addClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = await roleService.getRoleBySlug(Roles.ROLE_CLIENT_ADMIN);
    if (!role) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    await clientService.createClient(role._id, req.body);
    const data = formatResponse(
      200,
      false,
      "Admin created successfully.",
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
