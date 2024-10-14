import { Request, Response } from "express";
import { countriesService } from "../../services";
import { formatResponse } from "../../helpers";

export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status?.toString();

    const countries = await countriesService.getAllCountries(status);

    const data = formatResponse(200, false, "Countries details.", {
      list: countries,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
