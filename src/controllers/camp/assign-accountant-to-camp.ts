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

export const assignAccountantToCamps = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.camp_id)) {
      const data = formatResponse(400, true, "Camp not found.", null);
      res.status(400).json(data);
      return;
    }

    const camp = await campService.getCampByClientIdAndId(
      req.decodedToken.data.id,
      req.body.camp_id
    );
    if (!camp) {
      const data = formatResponse(400, true, "Camp not found.", null);
      res.status(400).json(data);
      return;
    }

    const accountant_array = req.body.accountants.split(",");
    if (hasDuplicate(accountant_array)) {
      const data = formatResponse(
        400,
        true,
        "No duplication allow in accountant ids selection.",
        null
      );
      res.status(400).json(data);
      return;
    }

    for (const accountants of accountant_array) {
      if (!isValidObjectId(accountants)) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_ACCOUNTANT_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }

      const clientIdPromise = accountantService.getAccountantById(
        accountants,
        req.decodedToken.data.id
      );
      const isCampAssignToAccountantPromise =
        campAssignAccountantService.isCampAssignWithAccountant(
          req.body.camp_id,
          accountants
        );
      const [clientId, isCampAssignToAccountant] = await Promise.all([
        clientIdPromise,
        isCampAssignToAccountantPromise,
      ]);
      if (!clientId || isCampAssignToAccountant) {
        const data = formatResponse(
          400,
          true,
          Message.SOMETHING_WRONG_IN_ACCOUNTANT_SELECTION,
          null
        );
        res.status(400).json(data);
        return;
      }
    }

    const count = await campAssignAccountantService.totalCountOfCamps(
      req.body.camp_id
    );
    const remainAccountant = camp.no_of_allowed_account - count;
    if (remainAccountant < accountant_array.length) {
      const data = formatResponse(
        400,
        true,
        "Your can't exceed camp accountant assign limit",
        null
      );
      res.status(400).json(data);
      return;
    }

    const promises = [];
    for (const accountants of accountant_array) {
      const obj = new db.campAssignAccountantModel();
      obj.camp_id = createObjectId(req.body.camp_id);
      obj.accountant_id = createObjectId(accountants);
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
