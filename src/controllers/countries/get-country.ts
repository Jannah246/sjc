import { Request, Response } from "express";
import { countriesService } from "../../services";
import { Message, formatResponse } from "../../helpers";

export const getOneCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const country = await countriesService.getCountryById(req.params.id);

    if (!country) {
      const data = formatResponse(400, true, Message.NOT_FOUND, null);
      res.status(400).json(data);
      return;
    }

    const data = formatResponse(200, false, "Country detail.", {
      list: country,
    });
    res.status(200).json(data);
    return;
  } catch (e: any) {
    const data = formatResponse(500, true, e.message, null);
    res.status(500).json(data);
    return;
  }
};
