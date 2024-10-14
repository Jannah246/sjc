import {
  createObjectId,
  getUrlForMongodb,
  getUrlOfProfileImage,
} from "../helpers";
import db from "../models";
import { ICampAssignPosDevice } from "../models/camp_assign_pos_device.model";
import { IUser } from "../models/user_register.model";
import { Obj, ObjectID } from "../types/interfaces";

const userRegisterModel = db.userRegisterModel;

export const findUserByMobileNumber = async (
  phone: string
): Promise<IUser | null> => {
  const result = await userRegisterModel.findOne({
    phone: phone,
    $or: [
      {
        status: 1,
      },
      {
        status: 5,
      },
    ],
  });
  return result;
};

export const findUserForVerification = async (
  phone: string,
  otp: number,
  device_mac_id: string,
  country_code: string
): Promise<IUser | null> => {
  const result = await userRegisterModel.findOne({
    phone: phone,
    otp: otp,
    device_mac_id: device_mac_id,
    country_code: country_code,
    status: 5,
  });
  return result;
};

export const isUuidFound = async (code: string): Promise<IUser | null> => {
  const result = await userRegisterModel.findOne({ uuid: code });
  return result;
};

export const createUser = async (obj: Obj): Promise<IUser> => {
  const result = await userRegisterModel.create(obj);
  return result;
};

export const updateUser = async (
  id: string,
  user: IUser
): Promise<IUser | null> => {
  const result = await userRegisterModel.findOneAndUpdate({ _id: id }, user, {
    new: true,
  });
  return result;
};

export const updateProfile = async (id: string, user: Obj): Promise<void> => {
  await userRegisterModel.updateOne({ _id: id }, user);
};

export const findUser = async (_id: ObjectID): Promise<IUser | null> => {
  const result = await userRegisterModel.findOne({ _id: _id, status: 1 });
  return result;
};

export const findUserWithWallet = async (
  _id: ObjectID
): Promise<IUser | null> => {
  const result = await userRegisterModel.aggregate([
    {
      $match: { _id: _id, status: 1 },
    },
    {
      $lookup: {
        from: "user_wallets",
        localField: "_id",
        foreignField: "user_id",
        as: "user_wallet",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              user_id: 1,
              client_id: 1,
              wallet_amount: 1,
              status: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: {
        path: "$user_wallet",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        id: "$_id",
      },
    },

    {
      $unset: ["__v", "_id", "wallet_balance", "user_wallet__v"],
    },
  ]);
  if (!result || !result.length) {
    return null;
  }
  return result[0];
};

export const checkEmail = async (
  email: string,
  id: string
): Promise<IUser | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
    _id: { $ne: createObjectId(id) },
  };
  const result = await userRegisterModel.findOne(filter);
  return result;
};

export const checkUniquePhone = async (
  phone: string,
  id: string
): Promise<IUser | null> => {
  const result = await userRegisterModel.findOne({
    phone: phone,
    status: 1,
    id: { $ne: createObjectId(id) },
  });
  return result;
};

export const userSearchWithKeyword = async (
  keyword: string
): Promise<Obj[] | []> => {
  const searchRegex = new RegExp(keyword, "i");
  const filter = {
    $or: [
      { uuid: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
    ],
    status: 1,
  };
  const result = await userRegisterModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "user_camps",
        localField: "_id",
        foreignField: "user_id",
        as: "camp_assign",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $lookup: {
              from: "camps",
              localField: "camp_id",
              foreignField: "_id",
              as: "camp_details",
            },
          },
          { $unwind: "$camp_details" },
          {
            $addFields: {
              id: "$_id",
              "camp_details.id": "$camp_details._id",
            },
          },
        ],
      },
    },

    {
      $unwind: {
        path: "$camp_assign",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "user_wallets",
        localField: "_id",
        foreignField: "user_id",
        as: "user_wallet",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $addFields: {
              id: "$_id",
            },
          },
          {
            $project: {
              _id: 0,
              id: 1,
              user_id: 1,
              client_id: 1,
              wallet_amount: 1,
              status: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: {
        path: "$user_wallet",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        id: "$_id",
        user_image: {
          $cond: {
            if: { $eq: ["$user_image", ""] },
            then: "",
            else: { $concat: [getUrlForMongodb, "$user_image"] },
          },
        },
        passport_image: {
          $cond: {
            if: { $eq: ["$passport_image", ""] },
            then: "",
            else: { $concat: [getUrlForMongodb, "$passport_image"] },
          },
        },
        national_id: {
          $cond: {
            if: { $eq: ["$national_id", ""] },
            then: "",
            else: { $concat: [getUrlForMongodb, "$national_id"] },
          },
        },
      },
    },

    {
      $unset: [
        "__v",
        "camp_assign.camp_details.__v",
        "camp_assign.__v",
        "_id",
        "camp_assign.camp_details._id",
        "camp_assign._id",
        "wallet_balance",
        "user_wallet__v",
      ],
    },
  ]);
  return result;
};
