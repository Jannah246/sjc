import { Request, Response } from "express";
import {
  coordinatorService,
  campAssignCoordinatorService,
  campService,
} from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  hasDuplicate,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignCampsToCoordinator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.coordinator_id)) {
      const data = formatResponse(400, true, "Coordinator not found.", null);
      res.status(400).json(data);
      return;
    }

    const coordinator = await coordinatorService.getCoordinatorById(
      req.body.coordinator_id,
      req.decodedToken.data.id
    );
    if (!coordinator) {
      const data = formatResponse(400, true, "Coordinator not found.", null);
      res.status(400).json(data);
      return;
    }

    const camp_array = req.body.camp_ids.split(",");
    if (hasDuplicate(camp_array)) {
      const data = formatResponse(
        400,
        true,
        "No duplication allow in camp ids selection.",
        null
      );
      res.status(400).json(data);
      return;
    }

    for (const camp of camp_array) {
      if (!isValidObjectId(camp)) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }

      const clientIdPromise = campService.getCampByClientIdAndId(
        req.decodedToken.data.id,
        camp
      );
      const isCampAssignToCoordinatorPromise =
        campAssignCoordinatorService.isCampAssignWithCoordinator(camp);
      const [clientId, isCampAssignToCoordinator] = await Promise.all([
        clientIdPromise,
        isCampAssignToCoordinatorPromise,
      ]);
      if (!clientId || isCampAssignToCoordinator) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }
    }

    const promises = [];
    for (const camp of camp_array) {
      const obj = new db.campAssignCoordinatorModel();
      obj.camp_id = createObjectId(camp);
      obj.coordinator_id = createObjectId(req.body.coordinator_id);
      obj.status = 1;
      promises.push(campAssignCoordinatorService.assignCampToCoordinator(obj));
    }
    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "Coordinator assigned to camps successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
