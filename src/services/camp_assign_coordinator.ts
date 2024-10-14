import db from "../models";
import { ICampAssignCoordinator } from "../models/camp_assign_coordinator.model";
import { Obj, ObjectID } from "../types/interfaces";

const campAssignCoordinatorModel = db.campAssignCoordinatorModel;

export const isCampAssignWithCoordinator = async (
  camp_id: string
): Promise<ICampAssignCoordinator | null> => {
  const result = await campAssignCoordinatorModel.findOne({
    camp_id: camp_id,
    status: 1,
  });
  return result;
};

export const totalCountOfCamps = async (camp_id: string): Promise<Number> => {
  const result = await campAssignCoordinatorModel.count({
    camp_id: camp_id,
    status: 1,
  });
  return result;
};
export const assignCampToCoordinator = async (
  obj: Obj
): Promise<ICampAssignCoordinator> => {
  const result = await campAssignCoordinatorModel.create(obj);
  return result;
};

export const getCampAssignCoordinatorDetails = async (
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
  const result = await campAssignCoordinatorModel.aggregate([
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "coordinators",
        localField: "coordinator_id",
        foreignField: "_id",
        as: "coordinator",
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
    { $unwind: "$coordinator" },

    {
      $unset: [
        "__v",
        "coordinator.__v",
        "_id",
        "coordinator._id",
        "coordinator.password",
      ],
    },
  ]);
  return result;
};

export const getCampByCoordinator = async (
  coordinatorId: ObjectID,
  status: string
): Promise<Obj[]> => {
  const filter = {
    coordinator_id: coordinatorId,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };
  const result = await campAssignCoordinatorModel.aggregate([
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
