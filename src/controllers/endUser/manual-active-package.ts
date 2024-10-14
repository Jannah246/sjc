import { Request, Response } from "express";
import {
  Message,
  createObjectId,
  formatResponse,
  generateRandomPackageCode,
  minuteInMilleSeconds,
  minutesToDay,
} from "../../helpers";
import {
  orderInternetPackageService,
  userCampService,
  userRechargeService,
  userWalletService,
} from "../../services";
import { isValidObjectId } from "mongoose";
import db from "../../models";
import {
  OrderStatus,
  RechargeTypeEnum,
  CreatedByUserType,
  RefundType,
} from "../../types/enums";
import { Obj } from "../../types/interfaces";
import dayjs from "dayjs";

export const manualActivePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData = req.decodedToken.data;
    if (!userData.location_camp.location_verified) {
      const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
      res.status(400).json(data);
      return;
    }

    const assignCampDetails = await userCampService.getAssignCampDetailsOfUser(
      userData.id
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
      userData.location_camp.location_camp_client_id.toString() !==
      assignCampDetails.client_id.toString()
    ) {
      const data = formatResponse(
        400,
        true,
        "Camp id and base camp id not of same client.",
        null
      );
      res.status(400).json(data);
      return;
    }

    if (!isValidObjectId(req.body.order_id)) {
      const data = formatResponse(
        400,
        true,
        "Internet package not available for user.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const orderDetails =
      await orderInternetPackageService.getManualPendingPackage(
        userData.id,
        req.body.order_id
      );
    if (!orderDetails) {
      const data = formatResponse(
        400,
        true,
        "Internet package not available for user.",
        null
      );
      res.status(400).json(data);
      return;
    }

    const activePackageForUser =
      await orderInternetPackageService.activeInternetPackageForUser(
        userData.id
      );
    const promises = [];

    //Refund amount
    if (activePackageForUser) {
      const perDayCost =
        activePackageForUser.package_amount /
        minutesToDay(activePackageForUser.duration);
      const currentDate = dayjs(new Date());
      const expireDate = dayjs(activePackageForUser.package_expiry_date);
      const remainDays = expireDate.diff(currentDate, "days");
      const refundAmount = parseFloat((remainDays * perDayCost).toFixed(2));

      //Save refund history
      const userRecharge = new db.userRechargeModel();
      userRecharge.user_id = createObjectId(userData.id);
      userRecharge.created_by = createObjectId(userData.id);
      userRecharge.created_by_type = CreatedByUserType.user;
      userRecharge.type = RechargeTypeEnum.REFUND;
      userRecharge.recharge_amount = refundAmount;
      userRecharge.service_amount = 0;
      userRecharge.camp_id = createObjectId(
        userData.location_camp.location_camp_id
      );
      userRecharge.payable_amount = refundAmount;
      userRecharge.status = 1;
      userRecharge.transaction_id = generateRandomPackageCode();
      const refundDetails: Obj = {};
      refundDetails.refund_type = RefundType.internet_package;
      refundDetails.reference_order_id = orderDetails._id;
      refundDetails.package_id = orderDetails.package_id;
      refundDetails.package_name = orderDetails.package_name;
      refundDetails.package_code = orderDetails.package_code;
      refundDetails.package_speed = orderDetails.package_speed;
      userRecharge.refund_details = refundDetails;

      promises.push(userRechargeService.createUserRecharge(userRecharge));

      //increase wallet
      promises.push(
        userWalletService.increaseAmount(
          userData.id,
          userData.location_camp.location_camp_client_id,
          refundAmount
        )
      );

      //DeActive current package
      promises.push(
        orderInternetPackageService.expireInternetPackage(
          activePackageForUser._id
        )
      );
    }

    const starDate = new Date();
    const expireDate = new Date(starDate.getTime());
    expireDate.setTime(
      expireDate.getTime() + minuteInMilleSeconds(orderDetails.duration)
    );
    const updateData = {
      package_start_date: starDate,
      package_expiry_date: expireDate,
      order_status: OrderStatus.active,
    };

    promises.push(
      orderInternetPackageService.updateInternetPackage(
        orderDetails._id,
        updateData
      )
    );

    await Promise.all(promises);

    const data = formatResponse(
      200,
      false,
      "Internet package activated successfully.",
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
