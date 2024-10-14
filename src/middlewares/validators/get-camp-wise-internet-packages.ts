import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";

const campInternetPackageSchema = Joi.object({
  profile_camp_id: Joi.string().required().messages({
    "any.required": "Camp id is required.",
    "string.empty": "Camp id is required.",
  }),
});

export const getCampWiseInternetPackageValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = campInternetPackageSchema.validate(req.query, {
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
