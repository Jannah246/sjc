import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { investorsService, roleService } from "../../services";
import { Roles } from "../../types/enums";

export const addInvestor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await roleService.getRoleBySlug(Roles.ROLE_INVESTOR);

    if (!role) {
      const data = formatResponse(
        401,
        true,
        "Investor role not available.",
        null
      );
      res.status(401).json(data);
      return;
    }

    let client_id = null;
    if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
      client_id = req.decodedToken.data.id;
    }

    req.body.client_id = client_id;

    await investorsService.createInvestor(role._id, req.body);

    const data = formatResponse(
      200,
      false,
      "Investor created successfully.",
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
