import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { authConfig } from "../../config/auth.config";
import { Message, formatResponse, validPassword } from "../../helpers";
import { adminService, roleService } from "../../services";

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await adminService.getAdminByEmail(req.body.email);
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
    const jwtData = {
      data: {
        id: user._id,
        email: user.email,
        role_id: user.role_id,
        name: role?.name,
        slug: role?.slug,
      },
    };
    //Generated jwt token
    const token = jwt.sign(jwtData, authConfig.token, {
      expiresIn: authConfig.expiresIn,
    });
    const data = formatResponse(201, false, Message.LOGIN_SUCCESS, {
      user_data: {
        id: user._id,
        email: user.email,
        role_id: user.role_id,
        name: role?.name,
        slug: role?.slug,
      },
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
