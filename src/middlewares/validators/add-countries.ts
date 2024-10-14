import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../../helpers";
import { errorValidatorResponse } from "../../helpers/error-validator-response";
import { countriesService } from "../../services";
import { Obj } from "../../types/interfaces";

const countrySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name field is required.",
    "string.empty": "Name field is required.",
  }),

  short_name: Joi.string().required().messages({
    "any.required": "Short name field is required.",
    "string.empty": "Short name field is required.",
  }),

  country_code: Joi.number().integer().required().messages({
    "any.required": "Country code field is required.",
    "string.empty": "Country code field is required.",
    "number.base": "Country code field must contain only numbers.",
    "number.integer": "Country code field must contain only numbers.",
  }),

  currency_code: Joi.string().required().messages({
    "any.required": "Currency code field is required.",
    "string.empty": "Currency code field is required.",
  }),
});

export const addCountryValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await countrySchema.validateAsync(req.body, { abortEarly: false });

    let objUnique = await checkUniqueValidations(req);

    let errorObj = {};
    if (objUnique.name) {
      errorObj = { name: "The name field must contain a unique value." };
    }
    if (objUnique.short_name) {
      errorObj = {
        ...errorObj,
        short_name: "The short name field must contain a unique value.",
      };
    }
    if (objUnique.country_code) {
      errorObj = {
        ...errorObj,
        country_code: "The country code field must contain a unique value.",
      };
    }
    if (objUnique.currency_code) {
      errorObj = {
        ...errorObj,
        currency_code: "The currency code field must contain a unique value.",
      };
    }
    if (Object.keys(errorObj).length === 0 && errorObj.constructor === Object) {
      return next();
    }
    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  } catch (error: any) {
    const { details } = error;
    let getErrorObj = errorValidatorResponse(details);
    let errorObj: Obj = {};
    errorObj.name = getErrorObj.name ? getErrorObj.name : "";
    errorObj.short_name = getErrorObj.short_name ? getErrorObj.short_name : "";
    errorObj.country_code = getErrorObj.country_code
      ? getErrorObj.country_code
      : "";
    errorObj.currency_code = getErrorObj.currency_code
      ? getErrorObj.currency_code
      : "";
    let objUnique = await checkUniqueValidations(req);
    if (objUnique.name) {
      errorObj.name = "The name field must contain a unique value.";
    }
    if (objUnique.short_name) {
      errorObj.short_name = "The short name field must contain a unique value.";
    }
    if (objUnique.country_code) {
      errorObj.country_code =
        "The country code field must contain a unique value.";
    }
    if (objUnique.currency_code) {
      errorObj.currency_code =
        "The currency code field must contain a unique value.";
    }
    for (const a in errorObj) {
      if (errorObj[a] === "") {
        delete errorObj[a];
      }
    }
    const data = formatResponse(400, true, errorObj, null);
    res.status(400).json(data);
    return;
  }
};

const checkUniqueValidations = async (req: Request) => {
  const countryResponse = await checkUniqueCountriesData(req);
  const objUnique = {
    name: false,
    short_name: false,
    country_code: false,
    currency_code: false,
  };
  if (countryResponse) {
    if (countryResponse?.name == req.body.name) {
      objUnique.name = true;
    }

    if (countryResponse?.short_name == req.body.short_name) {
      objUnique.short_name = true;
    }

    if (countryResponse?.country_code == req.body.country_code) {
      objUnique.country_code = true;
    }

    if (countryResponse?.currency_code == req.body.currency_code) {
      objUnique.currency_code = true;
    }
  }
  return objUnique;
};

const checkUniqueCountriesData = async (req: Request) => {
  return await countriesService.checkCountriesData(
    req.body,
    req.params && req.params.id ? req.params.id : undefined
  );
};
