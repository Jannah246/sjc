import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import {
  Message,
  formatResponse,
  parseToSimpleObj,
  validPassword,
} from "../../helpers";
import { plantManagerService, roleService } from "../../services";

export const plantManagerLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userPlantManager = await plantManagerService.getPlantManagerByEmail(
      req.body.email
    );
    if (!userPlantManager) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (!validPassword(req.body.password, userPlantManager.password)) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    const role = await roleService.getRoleById(userPlantManager.role_id);
    const plantManager = parseToSimpleObj(userPlantManager);
    delete plantManager.password;
    const jwtData = {
      data: {
        ...plantManager,
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
