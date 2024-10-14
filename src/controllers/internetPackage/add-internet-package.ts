import { Request, Response } from "express";
import { internetPackageService } from "../../services";
import { formatResponse, generateRandomPackageCode } from "../../helpers";

export const addInternetPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let code = "";
    const internetPackageModel = req.body;
    let packageCodeFound = null;

    do {
      code = generateRandomPackageCode();
      packageCodeFound = await internetPackageService.isPackageCodeFound(code);
    } while (packageCodeFound != null);

    internetPackageModel.package_code = code;

    await internetPackageService.createInternetPackage(internetPackageModel);
    const data = formatResponse(
      200,
      false,
      "Internet package created successfully.",
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
