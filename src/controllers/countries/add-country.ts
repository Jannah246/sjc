import { Request, Response } from "express";
import { formatResponse } from "../../helpers";
import { countriesService } from "../../services";

export const addCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await countriesService.createCountry(req.body);

    const data = formatResponse(
      200,
      false,
      "Country created successfully.",
      null
    );
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
