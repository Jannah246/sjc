import coreJoi from "joi";
import joiDate from "@joi/date";
const Joi = coreJoi.extend(joiDate) as typeof coreJoi;
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { nationalTypeService } from "../../services";

const addClientSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name field is required.",
    "string.empty": "Name field is required.",
  }),
});

export const addNationalTypeValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addClientSchema.validateAsync(req.body, { abortEarly: false });
    const isNameInUse = await checkUniqueName(req);
    if (!isNameInUse) {
      return next();
    }

    const data = formatResponse(
      400,
      true,
      { email: "The name field must contain a unique value." },
      null
    );
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let errorObj = errorValidatorResponse(details);
    if (!errorObj.email) {
      const isNameInUse = await checkUniqueName(req);
      if (isNameInUse) {
        errorObj = {
          email: "The name field must contain a unique value.",
          ...errorObj,
        };
      }
    }

    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkUniqueName = async (req: Request) => {
  return await nationalTypeService.checkUniqueName(
    req.body.name,
    req.params && req.params.id ? req.params.id : undefined
  );
};
