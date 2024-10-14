import db from "../models";
import { IAdmin } from "../models/admin.model";
import { Obj, ObjectID } from "../types/interfaces";

const adminModel = db.adminModel;

export const getAdminByEmail = async (
  email: string
): Promise<IAdmin | null> => {
  const result = await adminModel.findOne({ email: email });
  return result;
};

export const getAdminById = async (_id: ObjectID): Promise<IAdmin | null> => {
  const result = await adminModel.findOne({ _id: _id });
  return result;
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await adminModel.updateOne({ _id: _id }, obj);
};

export const getAdminWithRole = async (
  _id: ObjectID
): Promise<IAdmin[] | []> => {
  const result = await adminModel.aggregate([
    {
      $match: {
        _id: _id,
      },
    },
    {
      $lookup: {
        from: "roles",
        as: "roles",
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $match: {
        "roles.name": "Admin",
      },
    },
    { $unwind: "$roles" },
  ]);
  return result;
};
