import { createObjectId, generateHash } from "../helpers";
import db from "../models";
import { IPos } from "../models/pos.model";
import { Obj, ObjectID } from "../types/interfaces";

const posModel = db.posModel;

export const checkEmail = async (
  email: string,
  id?: string
): Promise<IPos | null> => {
  const filter: Obj = {
    email: email,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }

  const result = await posModel.findOne(filter);
  return result;
};

export const checkIp = async (
  ip: string,
  id?: string
): Promise<IPos | null> => {
  const filter: Obj = {
    ip_mac: ip,
    status: {
      $ne: 0,
    },
  };
  if (id) {
    filter._id = { $ne: createObjectId(id) };
  }
  const result = await posModel.findOne(filter);
  return result;
};

export const getPosCount = async (clientId: string): Promise<Number> => {
  const result = await posModel.count({
    client_id: clientId,
    status: {
      $ne: 0,
    },
  });
  return result;
};

export const getPosById = async (id: string): Promise<IPos | null> => {
  const result = await posModel.findOne({ _id: id, status: 1 });
  return result;
};

export const getPosByIdWithoutStatus = async (
  id: string
): Promise<IPos | null> => {
  const result = await posModel.findOne({ _id: id });
  return result;
};

export const createPos = async (
  clientId: ObjectID,
  roleId: ObjectID,
  posObj: Obj
): Promise<IPos> => {
  const pos = posObj as IPos;
  pos.status = 1;
  pos.role_id = roleId;
  pos.client_id = clientId;
  pos.password = generateHash(pos.password);
  return await posModel.create(pos);
};

export const updatePos = async (id: string, posObj: Obj): Promise<void> => {
  const pos = posObj as IPos;
  pos.password = generateHash(pos.password);
  await posModel.updateOne({ _id: id }, pos);
};

export const updateStatus = async (
  id: string,
  status: number
): Promise<void> => {
  await posModel.updateOne({ _id: id }, { status: status });
};

export const getAllPos = async (
  id: string,
  status?: string
): Promise<IPos[] | any> => {
  const filter = {
    client_id: id,
    status: status
      ? parseInt(status)
      : {
          $ne: 0,
        },
  };

  const result = await posModel.find(filter);
  return result;
};

export const getPosByClientIdAndId = async (
  clientId: string,
  id: string
): Promise<IPos | null> => {
  const result = await posModel.findOne({
    _id: id,
    client_id: clientId,
    status: 1,
  });
  return result;
};

export const getPosByEmail = async (email: string): Promise<IPos | null> => {
  const result = await posModel.findOne({ email: email, status: 1 });
  return result;
};

export const getPosWithRole = async (_id: ObjectID): Promise<IPos[] | []> => {
  const result = await posModel.aggregate([
    {
      $match: { _id: _id, status: 1 },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role_id",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1 } }],
        as: "roles",
      },
    },
    {
      $match: {
        "roles.name": "POS",
      },
    },
    { $unwind: "$roles" },
  ]);
  return result;
};

export const updateOne = async (_id: ObjectID, obj: Obj): Promise<void> => {
  await posModel.updateOne({ _id: _id }, obj);
};
