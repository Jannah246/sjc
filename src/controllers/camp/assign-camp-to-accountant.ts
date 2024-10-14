import { Request, Response } from "express";
import {
  accountantService,
  campAssignAccountantService,
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

export const assignCampsToAccountant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.accountant_id)) {
      const data = formatResponse(400, true, "Accountant not found.", null);
      res.status(400).json(data);
      return;
    }

    const accountant = await accountantService.getAccountantById(
      req.body.accountant_id,
      req.decodedToken.data.id
    );
    if (!accountant) {
      const data = formatResponse(400, true, "Accountant not found.", null);
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

    const camps = [];
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
      const isCampAssignToAccountantPromise =
        campAssignAccountantService.isCampAssignWithAccountant(
          camp,
          req.body.accountant_id
        );
      const [clientId, isCampAssignToAccountant] = await Promise.all([
        clientIdPromise,
        isCampAssignToAccountantPromise,
      ]);
      if (!clientId || isCampAssignToAccountant) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_CAMP_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }
      camps.push(clientId);
    }
    for (const camp of camp_array) {
      const count = await campAssignAccountantService.totalCountOfCamps(camp);
      const index = camp_array.indexOf(camp);
      if (count >= camps[index].no_of_allowed_account) {
        const data = formatResponse(
          400,
          true,
          "Your can't exceed camp accountant assign limit",
          null
        );
        res.status(400).json(data);
        return;
      }
    }

    const promises = [];
    for (const camp of camp_array) {
      const obj = new db.campAssignAccountantModel();
      obj.camp_id = createObjectId(camp);
      obj.accountant_id = createObjectId(req.body.accountant_id);
      obj.status = 1;
      promises.push(campAssignAccountantService.assignCampToAccountant(obj));
    }
    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "Accountant assigned to camps successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
