import { Request, Response } from "express";
import {
  CampAssignPosService,
  userCampService,
  userRechargeService,
  userRegisterService,
  userWalletService,
} from "../../services";
import {
  Message,
  createObjectId,
  formatResponse,
  generateRandomPackageCode,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import db from "../../models";
import {
  PosCategoryEnum,
  RechargeTypeEnum,
  CreatedByUserType,
} from "../../types/enums";

export const userWalletRecharge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!isValidObjectId(req.body.profile_camp_id)) {
      const data = formatResponse(400, true, Message.CAMP_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const campAssignPos = await CampAssignPosService.isCampAssignToPos(
      req.decodedToken.data.id,
      req.body.profile_camp_id
    );
    if (!campAssignPos) {
      const data = formatResponse(400, true, "Camp not assigned to pos.", null);
      res.status(400).json(data);
      return;
    }

    if (campAssignPos.camp_category == PosCategoryEnum.OFFLINE) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }

    if (!isValidObjectId(req.body.user_id)) {
      const data = formatResponse(400, true, Message.USER_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const user = await userRegisterService.findUser(
      createObjectId(req.body.user_id)
    );
    if (!user) {
      const data = formatResponse(400, true, Message.USER_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const assignCampDetails = await userCampService.getAssignCampDetailsOfUser(
      req.body.user_id
    );
    if (!assignCampDetails) {
      const data = formatResponse(
        400,
        true,
        "User not assigned to any camp.",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (req.decodedToken.data.client_id != assignCampDetails.client_id) {
      const data = formatResponse(
        400,
        true,
        "User and pos user not of same client.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const promises = [];
    const walletData = await userWalletService.walletAvailableForUserAndClient(
      req.decodedToken.data.client_id,
      req.body.user_id
    );
    if (walletData) {
      const wallet_balance =
        walletData.wallet_amount + parseFloat(req.body.recharge_amount);
      promises.push(
        userWalletService.updateWalletAmount(walletData._id, wallet_balance)
      );
    } else {
      const wallet = new db.userWalletModel();
      wallet.user_id = createObjectId(req.body.user_id);
      wallet.client_id = createObjectId(req.decodedToken.data.client_id);
      wallet.wallet_amount = parseFloat(req.body.recharge_amount);
      wallet.status = 1;
      promises.push(userWalletService.createWallet(wallet));
    }

    const userRecharge = new db.userRechargeModel();
    userRecharge.user_id = user._id;
    userRecharge.created_by = createObjectId(req.decodedToken.data.id);
    userRecharge.created_by_type = CreatedByUserType.pos;
    userRecharge.role_id = createObjectId(req.decodedToken.data.role_id);
    userRecharge.type = RechargeTypeEnum.POS_TOP_UP;
    userRecharge.recharge_amount = req.body.recharge_amount;
    userRecharge.service_amount = req.body.service_amount;
    userRecharge.camp_id = createObjectId(req.body.profile_camp_id);
    userRecharge.payable_amount =
      parseFloat(req.body.recharge_amount) +
      parseFloat(req.body.service_amount);
    userRecharge.status = 1;
    userRecharge.transaction_id = generateRandomPackageCode();

    promises.push(userRechargeService.createUserRecharge(userRecharge));

    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "User recharge done successfully",
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
