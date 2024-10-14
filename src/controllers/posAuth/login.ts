import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import {
  Message,
  formatResponse,
  parseToSimpleObj,
  validPassword,
} from "../../helpers";
import {
  CampAssignPosService,
  campAssignPosDeviceService,
  campService,
  clientService,
  posAssignPosDeviceService,
  posDeviceCodeHistoryService,
  posService,
  roleService,
} from "../../services";
import { isValidObjectId } from "mongoose";

export const posLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await posService.getPosByEmail(req.body.email);
    if (!user) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (!validPassword(req.body.password, user.password)) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (user.client_id) {
      const client = await clientService.getClientById(
        user.client_id.toString()
      );
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    const deviceHistory =
      await posDeviceCodeHistoryService.getDeviceByMacAddress(
        req.body.device_mac_address
      );
    if (!deviceHistory) {
      const data = formatResponse(401, true, "Device is not active.", null);
      res.status(401).json(data);
      return;
    }

    if (!isValidObjectId(req.body.camp_id)) {
      const data = formatResponse(400, true, Message.CAMP_NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const camp = await campService.getCampById(req.body.camp_id);
    if (!camp) {
      const data = formatResponse(401, true, Message.CAMP_NOT_FOUND, null);
      res.status(401).json(data);
      return;
    }

    const deviceCodeId = deviceHistory.pos_dc_id;
    const campId = camp._id;

    const deviceAssignedToCamp =
      await campAssignPosDeviceService.isCampAssignToDeviceModel(
        deviceCodeId.toString(),
        campId.toString()
      );
    if (!deviceAssignedToCamp) {
      const data = formatResponse(
        401,
        true,
        "Device code not assigned to camp.",
        null
      );
      res.status(401).json(data);
      return;
    }

    const deviceAssignedToPos =
      await posAssignPosDeviceService.isPosAssignToDeviceModel(
        deviceCodeId.toString(),
        user._id.toString()
      );
    if (!deviceAssignedToPos) {
      const data = formatResponse(
        401,
        true,
        "Device code not assigned to pos user.",
        null
      );
      res.status(401).json(data);
      return;
    }

    const campAssignedToUser = await CampAssignPosService.isCampAssignToPos(
      user._id.toString(),
      campId.toString()
    );
    if (!campAssignedToUser) {
      const data = formatResponse(
        401,
        true,
        "Camp not assigned to pos user.",
        null
      );
      res.status(401).json(data);
      return;
    }

    //Moving onsite camp to offline
    await CampAssignPosService.campMoveOnsiteToOffsite(user._id.toString());
    //Transferring login camp to Onsite
    await CampAssignPosService.campMoveToOnsite(
      campAssignedToUser._id.toString()
    );

    const role = await roleService.getRoleById(user.role_id);
    const pos = parseToSimpleObj(user);
    delete pos.password;

    const camp_details = {
      camp_id: campId,
      camp_name: camp.camp_name,
      router_primary_ip: camp.router_primary_ip,
      router_mac_address: camp.router_mac_address,
    };

    const dcDetails = {
      pos_dc_id: deviceCodeId,
      device_name: deviceHistory.device_name,
      device_model: deviceHistory.device_model,
      device_mac_address: deviceHistory.device_mac_address,
      device_history_id: deviceHistory._id,
    };

    const jwtData = {
      data: {
        ...pos,
        name: role?.name,
        slug: role?.slug,
        role_slug: role?.slug,
        camp: camp_details,
        device: dcDetails,
      },
    };
    //Generated jwt token
    const token = jwt.sign(jwtData, authConfig.token, {
      expiresIn: authConfig.expiresIn,
    });
    const data = formatResponse(201, false, Message.LOGIN_SUCCESS, {
      user_data: jwtData.data,
      token: token,
    });
    res.status(201).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
