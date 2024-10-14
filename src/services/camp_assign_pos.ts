import { createObjectId } from "../helpers";
import db from "../models";
import { ICampAssignPos } from "../models/camp_assign_pos.model";
import { PosCategoryEnum } from "../types/enums";
import { Obj, ObjectID } from "../types/interfaces";
import { IDbCampByPosId } from "../types/interfaces/IDbCampByPosId";

const campAssignPosModel = db.campAssignPosModel;

export const isCampAssignToPos = async (
  pos_id: string,
  camp_id: string
): Promise<ICampAssignPos | null> => {
  const result = await campAssignPosModel.findOne({
    pos_id: pos_id,
    camp_id: camp_id,
    status: 1,
  });
  return result;
};

export const assignCampToPos = async (obj: Obj): Promise<ICampAssignPos> => {
  const result = await campAssignPosModel.create(obj);
  return result;
};

export const campMoveToOnsite = async (id: string): Promise<void> => {
  await campAssignPosModel.updateOne(
    { _id: id },
    { camp_category: PosCategoryEnum.ONSITE }
  );
};

export const campMoveOnsiteToOffsite = async (posId: string): Promise<void> => {
  await campAssignPosModel.updateMany(
    { pos_id: posId, camp_category: PosCategoryEnum.ONSITE },
    { camp_category: PosCategoryEnum.OFFLINE }
  );
};

export const getCampDetails = async (
  posId: string
): Promise<IDbCampByPosId[] | []> => {
  const result = await campAssignPosModel.aggregate([
    {
      $match: { pos_id: createObjectId(posId), status: 1 },
    },
    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "camp",
        pipeline: [
          {
            $match: {
              status: 1,
            },
          },
          {
            $project: {
              campId: "$_id",
              _id: 0,
              camp_name: 1,
              camp_address: 1,
              camp_city: 1,
              router_primary_ip: 1,
              no_of_allowed_user: 1,
              no_of_allowed_kiosk: 1,
              no_of_allowed_account: 1,
              no_of_allowed_coordinators: 1,
              is_allowed_package_meal: 1,
              is_allowed_package_water: 1,
              is_allowed_package_internet: 1,
              router_mac_address: 1,
              router_ssid: 1,
              router_secondary_ip: 1,
              router_pass: 1,
              router_secret: 1,
              router_alias: 1,
              router_hostname: 1,
              camp_uuid: 1,
              client_id: 1,
              status: 1,
            },
          },
        ],
      },
    },

    { $unwind: "$camp" },
    {
      $project: {
        campAssignPosId: "$_id",
        _id: 0,
        camp_id: 1,
        pos_id: 1,
        camp_category: 1,
        status: 1,
        camp: 1,
      },
    },
  ]);
  return result;
};

export const getCampAssignPosDetails = async (
  campId: ObjectID,
  status: string
): Promise<Obj[]> => {
  const filter = {
    camp_id: campId,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await campAssignPosModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "pos",
        localField: "pos_id",
        foreignField: "_id",
        as: "pos",
        pipeline: [
          {
            $addFields: {
              id: "$_id",
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assigned_id: "$_id",
      },
    },
    { $unwind: "$pos" },

    {
      $unset: ["__v", "pos.__v", "_id", "pos._id", "pos.password"],
    },
  ]);
  return result;
};
