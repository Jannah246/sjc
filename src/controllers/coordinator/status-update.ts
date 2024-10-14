import { Request, Response } from "express";
import { coordinatorService } from "../../services";
import { Message, formatResponse } from "../../helpers";
import { Roles } from "../../types/enums";

export const coordinatorStatusUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let client_id = null;
    if (req.decodedToken.data.role_slug == Roles.ROLE_CLIENT_ADMIN) {
      client_id = req.decodedToken.data.id;
    }

    const coordinator =
      await coordinatorService.getCoordinatorByIdWithoutStatus(
        req.params.id,
        client_id
      );

    if (!coordinator) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    await coordinatorService.updateStatus(req.params.id, req.body.status);

    const data = formatResponse(
      200,
      false,
      "Coordinator status updated successfully.",
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
