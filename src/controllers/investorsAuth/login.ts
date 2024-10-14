import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import {
  Message,
  formatResponse,
  parseToSimpleObj,
  validPassword,
} from "../../helpers";
import { clientService, investorsService, roleService } from "../../services";

export const investorLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userInvestor = await investorsService.getInvestorByEmail(
      req.body.email
    );
    if (!userInvestor) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (!validPassword(req.body.password, userInvestor.password)) {
      const data = formatResponse(401, true, Message.INCORRECT_LOGIN, null);
      res.status(401).json(data);
      return;
    }

    if (userInvestor.client_id) {
      const client = await clientService.getClientById(
        userInvestor.client_id.toString()
      );
      if (!client) {
        const data = formatResponse(401, true, Message.ACCESS_DENIED, null);
        res.status(401).json(data);
        return;
      }
    }

    const role = await roleService.getRoleById(userInvestor.role_id);
    const investor = parseToSimpleObj(userInvestor);
    delete investor.password;
    const jwtData = {
      data: {
        ...investor,
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
