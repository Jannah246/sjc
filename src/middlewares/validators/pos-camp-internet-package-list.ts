import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const PosCampInternetPackageList = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "User id is required.",
    "string.empty": "User id is required.",
  }),
  order_status: Joi.number().integer().valid(1, 2, 3).messages({
    "any.only": "The order status field must be one of: 1,2,3.",
    "number.base": "The order status field must be one of: 1,2,3.",
    "number.integer": "The order status field must be one of:1,2,3.",
  }),
});

export const posCampInternetPackageListValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = PosCampInternetPackageList.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const { details } = error;
    const data = formatResponse(
      400,
      true,
      errorValidatorResponse(details),
      null
    );
    res.status(400).json(data);
    return;
  }

  next();
};
