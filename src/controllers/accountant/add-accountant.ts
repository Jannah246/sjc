import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { accountantService, roleService } from "../../services";
import { Roles } from "../../types/enums";

export const addAccountant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await roleService.getRoleBySlug(Roles.ROLE_ACCOUNTANT);

    if (!role) {
      const data = formatResponse(
        401,
        true,
        "Accountant role not available.",
        null
      );
      res.status(401).json(data);
      return;
    }

    let client_id = null;
    if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
      const totalCount = await accountantService.getAccountantCount(
        req.decodedToken.data.id
      );

      const limit = req.decodedToken.data.no_accountant;

      if (totalCount >= limit) {
        const data = formatResponse(
          400,
          true,
          "Your can't exceed your accountant limit",
          null
        );
        res.status(200).json(data);
        return;
      }

      client_id = req.decodedToken.data.id;
    }

    req.body.client_id = client_id;

    await accountantService.createAccountant(role._id, req.body);

    const data = formatResponse(
      200,
      false,
      "Accountant created successfully.",
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
