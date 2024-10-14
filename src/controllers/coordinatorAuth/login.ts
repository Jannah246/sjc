import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import {
  Message,
  formatResponse,
  parseToSimpleObj,
  validPassword,
} from "../../helpers";
import { clientService, coordinatorService, roleService } from "../../services";

export const coordinatorLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userCoordinator = await coordinatorService.getCoordinatorByEmail(
      req.body.email
    );
    if (!userCoordinator) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (!validPassword(req.body.password, userCoordinator.password)) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (userCoordinator.client_id) {
      const client = await clientService.getClientById(
        userCoordinator.client_id.toString()
      );
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    const role = await roleService.getRoleById(userCoordinator.role_id);
    const coordinator = parseToSimpleObj(userCoordinator);
    delete coordinator.password;
    const jwtData = {
      data: {
        ...coordinator,
        name: role?.name,
        slug: role?.slug,
        role_slug: role?.slug,
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
