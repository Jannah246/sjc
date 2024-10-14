import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import {
  Message,
  formatResponse,
  parseToSimpleObj,
  validPassword,
} from "../../helpers";
import { clientService, roleService } from "../../services";

export const clientLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await clientService.getClientByEmail(req.body.email);
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

    const role = await roleService.getRoleById(user.role_id);
    const client = parseToSimpleObj(user);
    delete client.password;
    const jwtData = {
      data: {
        ...client,
        name: role?.name,
        slug: role?.slug,
        role_slug: role?.slug,
        client_id: user._id,
        total_coordinator: 0, //TODO remain total coordinator count
        total_accountant: 0, //TODO remain total account count
        total_pos: 0, //TODO remain total pos count
        total_camp: 0, //TODO remain total camp count
        total_user: 0, //TODO remain total user count
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
