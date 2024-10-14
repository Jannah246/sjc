import { Request, Response } from "express";
import { Message, deleteFile, formatResponse, userDir } from "../../helpers";
import {
  countriesService,
  nationalTypeService,
  userRegisterService,
} from "../../services";

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const userData = req.decodedToken.data;
    // if (!userData.location_camp.location_verified) {
    //   const data = formatResponse(400, true, Message.OUT_OF_SERVICE_AREA, null);
    //   res.status(400).json(data);
    //   return;
    // }
    const user = await userRegisterService.findUser(req.decodedToken.data.id);
    if (!user) {
      const data = formatResponse(
        400,
        true,
        Message.SOMETHING_WENT_WRONG,
        null
      );
      res.status(400).json(data);
      return;
    }

    if (req.body.country_id) {
      const country = await countriesService.getCountryById(
        req.body.country_id
      );
      if (!country) {
        const data = formatResponse(400, true, "Country not found.", null);
        res.status(400).json(data);
        return;
      }
    }

    if (req.body.national_id_type) {
      const national_id_type = await nationalTypeService.getNationalTypeById(
        req.body.national_id_type
      );
      if (!national_id_type) {
        const data = formatResponse(
          400,
          true,
          "National id type not found.",
          null
        );
        res.status(400).json(data);
        return;
      }
    }

    let national_id = "";
    let user_image = "";
    let passport_image = "";

    if (req.files.national_id && req.files.national_id.length) {
      national_id = req.files.national_id[0].filename;
      if (user.national_id) {
        await deleteFile(userDir + user.national_id);
      }
    }

    if (req.files.user_image && req.files.user_image.length) {
      user_image = req.files.user_image[0].filename;
      if (user.user_image) {
        await deleteFile(userDir + user.user_image);
      }
    }

    if (req.files.passport_image && req.files.passport_image.length) {
      passport_image = req.files.passport_image[0].filename;
      if (user.passport_image) {
        await deleteFile(userDir + user.passport_image);
      }
    }

    if (national_id) {
      req.body.national_id = national_id;
    }

    if (user_image) {
      req.body.user_image = user_image;
    }

    if (passport_image) {
      req.body.passport_image = passport_image;
    }

    await userRegisterService.updateProfile(req.decodedToken.data.id, req.body);
    const data = formatResponse(
      200,
      false,
      `Profile updated successFully.`,
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
