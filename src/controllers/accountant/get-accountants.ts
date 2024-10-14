import { Request, Response } from "express";
import { accountantService } from "../../services";
import { formatResponse } from "../../helpers";
import { Roles } from "../../types/enums";

export const getAllAccountants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();

    let client_id = null;
    if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
      client_id = req.decodedToken.data.id;
    }

    const filter = {
      client_id: client_id,
      status: status
        ? parseInt(status)
        : {
            $ne: 0,
          },
    };

    const accountants = await accountantService.getAllAccountant(filter);

    const data = formatResponse(200, false, "Accountant details.", {
      list: accountants,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
