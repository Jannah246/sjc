import db from "../models";
import { ICampAssignAccountant } from "../models/camp_assign_accountant.model";
import { ICampAssignCoordinator } from "../models/camp_assign_coordinator.model";
import { Obj, ObjectID } from "../types/interfaces";

const campAssignAccountantModel = db.campAssignAccountantModel;

export const isCampAssignWithAccountant = async (
  camp_id: string,
  account_id: string
): Promise<ICampAssignAccountant | null> => {
  const result = await campAssignAccountantModel.findOne({
    camp_id: camp_id,
    accountant_id: account_id,
    status: 1,
  });
  return result;
};

export const totalCountOfCamps = async (camp_id: string): Promise<number> => {
  const result = await campAssignAccountantModel.count({
    camp_id: camp_id,
    status: 1,
  });
  return result;
};
export const assignCampToAccountant = async (
  obj: Obj
): Promise<ICampAssignAccountant> => {
  const result = await campAssignAccountantModel.create(obj);
  return result;
};

export const getCampAssignAccountantDetails = async (
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
  const result = await campAssignAccountantModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "accountants",
        localField: "accountant_id",
        foreignField: "_id",
        as: "accountant",
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
    { $unwind: "$accountant" },

    {
      $unset: [
        "__v",
        "accountant.__v",
        "_id",
        "accountant._id",
        "accountant.password",
      ],
    },
  ]);
  return result;
};

export const getCampByAccountant = async (
  account_id: ObjectID,
  status: string
): Promise<Obj[]> => {
  const filter = {
    accountant_id: account_id,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await campAssignAccountantModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "camps",
        localField: "camp_id",
        foreignField: "_id",
        as: "camp",
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
    { $unwind: "$camp" },

    {
      $unset: ["__v", "camp.__v", "_id", "camp._id"],
    },
  ]);
  return result;
};
