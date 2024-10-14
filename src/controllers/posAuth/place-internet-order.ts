import { Request, Response } from "express";
import {
  Message,
  createObjectId,
  formatResponse,
  generateRandomPackageCode,
  minuteInMilleSeconds,
} from "../../helpers";
import { isValidObjectId } from "mongoose";
import {
  CampAssignPosService,
  internetPackageClientService,
  orderInternetPackageService,
  userCampService,
  userRegisterService,
  userWalletService,
} from "../../services";
import db from "../../models";
import {
  OrderStatus,
  PosCategoryEnum,
  CreatedByUserType,
} from "../../types/enums";

export const placeInternetOrder = async (
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

    if (
      req.decodedToken.data.client_id !== assignCampDetails.client_id.toString()
    ) {
      const data = formatResponse(
        400,
        true,
        "User and pos user not of same client.",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (!isValidObjectId(req.body.package_id)) {
      const data = formatResponse(400, true, "Package not found.", null);
      res.status(400).json(data);
      return;
    }

    const packageData =
      await internetPackageClientService.getInternetPackageFromCampAndPackageId(
        createObjectId(req.body.profile_camp_id),
        createObjectId(req.body.package_id)
      );
    if (!packageData) {
      const data = formatResponse(400, true, "Package not available.", null);
      res.status(400).json(data);
      return;
    }

    const wallet = await userWalletService.walletAvailableForUserAndClient(
      req.decodedToken.data.client_id,
      req.body.user_id
    );
    if (!wallet) {
      const data = formatResponse(
        400,
        true,
        Message.INSUFFICIENT_BALANCE,
        null
      );
      res.status(400).json(data);
      return;
    }

    const orderPrice = packageData.internet_package_client.package_price;
    if (orderPrice > wallet.wallet_amount) {
      const data = formatResponse(
        400,
        true,
        Message.INSUFFICIENT_BALANCE,
        null
      );
      res.status(400).json(data);
      return;
    }

    const activeInternetPackage =
      await orderInternetPackageService.activeInternetPackageForUser(
        req.body.user_id
      );

    const order = new db.orderInternetPackageModel();
    order.order_number = generateRandomPackageCode();
    order.user_id = createObjectId(req.body.user_id);
    order.package_id = createObjectId(req.body.package_id);
    order.package_name = packageData.internet_package_client.package_name;
    order.package_code = packageData.internet_package_client.package_code;
    order.package_speed = packageData.internet_package_client.package_speed;
    order.package_amount = orderPrice;
    const originalInternetPackage =
      packageData.internet_package_client.internet_package;
    order.duration = originalInternetPackage.duration;
    order.volume = originalInternetPackage.volume;
    order.download_bandwidth = originalInternetPackage.download_bandwidth;
    order.upload_bandwidth = originalInternetPackage.upload_bandwidth;
    order.package_type = originalInternetPackage.type;
    order.sub_total = orderPrice;
    order.payable_amount = orderPrice;
    order.created_by = createObjectId(req.decodedToken.data.id);
    order.created_by_type = CreatedByUserType.pos;
    order.camp_id = createObjectId(req.body.profile_camp_id);

    const promises = [];

    if (!activeInternetPackage) {
      const starDate = new Date();
      const expireDate = new Date(starDate.getTime());
      expireDate.setTime(
        expireDate.getTime() + minuteInMilleSeconds(order.duration)
      );
      order.package_start_date = starDate;
      order.purchase_date = starDate;
      order.package_expiry_date = expireDate;
      order.order_status = OrderStatus.active;
    } else {
      order.package_start_date = null;
      order.purchase_date = new Date();
      order.package_expiry_date = null;
      order.order_status = OrderStatus.pending;
    }

    const wallet_amount = wallet.wallet_amount - orderPrice;
    promises.push(
      orderInternetPackageService.createOrderInternetPackage(order)
    );
    promises.push(
      userWalletService.updateWalletAmount(wallet._id, wallet_amount)
    );

    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      `#${order.order_number} order has been created successfully`,
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
