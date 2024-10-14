import { Request, Response } from "express";
import {
  CampAssignPosService,
  campAssignPosDeviceService,
  campService,
  clientService,
  posDeviceCodeService,
  posService,
} from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  generateRandomDeviceCode,
  hasDuplicate,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";

export const assignCampsToPos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.pos)) {
      const data = formatResponse(
        400,
        true,
        "POS user record not available",
        null
      );
      res.status(400).json(data);
      return;
    }

    const pos = await posService.getPosByClientIdAndId(
      req.decodedToken.data.id,
      req.body.pos
    );
    if (!pos) {
      const data = formatResponse(
        400,
        true,
        "POS user record not available",
        null
      );
      res.status(400).json(data);
      return;
    }

    const camp_array = req.body.camp_ids.split(",");
    const camp_categories = req.body.camp_categories.split(",");
    if (camp_array.length != camp_categories.length) {
      const data = formatResponse(
        400,
        true,
        "Camp ids not match with camp categories length.Need to require same length for camp ids and camp categories.",
        null
      );
      res.status(400).json(data);
      return;
    }

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
      const isCampAssignToPosPromise = CampAssignPosService.isCampAssignToPos(
        req.body.pos,
        camp
      );
      const [clientId, isCampAssignToPos] = await Promise.all([
        clientIdPromise,
        isCampAssignToPosPromise,
      ]);
      if (!clientId || isCampAssignToPos) {
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
      const obj = new db.campAssignPosModel();
      obj.camp_id = createObjectId(camp);
      obj.pos_id = createObjectId(req.body.pos);
      obj.camp_category = camp_categories[camp_array.indexOf(camp)];
      obj.status = 1;
      promises.push(CampAssignPosService.assignCampToPos(obj));
    }
    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "Pos assigned to camps successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
  }
};
